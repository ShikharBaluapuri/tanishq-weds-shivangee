-- Server-only, durable throttling. Keys are HMAC digests, never raw IPs/phones.
create table public.wedding_request_limits (
  bucket_key text primary key,
  window_start timestamptz not null,
  hits integer not null check(hits>0)
);
alter table public.wedding_request_limits enable row level security;
revoke all on public.wedding_request_limits from public,anon,authenticated;
grant all on public.wedding_request_limits to service_role;
create function public.take_wedding_request(bucket text,max_hits integer,window_seconds integer)
returns boolean language plpgsql security invoker set search_path=public as $$
declare n integer;
begin
  if length(bucket)>100 or max_hits<1 or window_seconds<60 then raise exception 'Invalid rate limit'; end if;
  insert into public.wedding_request_limits(bucket_key,window_start,hits) values(bucket,now(),1)
  on conflict(bucket_key) do update set
    hits=case when wedding_request_limits.window_start<now()-make_interval(secs=>window_seconds) then 1 else wedding_request_limits.hits+1 end,
    window_start=case when wedding_request_limits.window_start<now()-make_interval(secs=>window_seconds) then now() else wedding_request_limits.window_start end
  returning hits into n;
  return n<=max_hits;
end;
$$;

-- Atomic acknowledgement prevents an old request from marking a newer edit synced.
create function public.ack_wedding_sync(job_id text,record_updated text)
returns boolean language plpgsql security invoker set search_path=public as $$
declare saved public.wedding_rsvps;
begin
  select * into saved from public.wedding_rsvps where rsvp_id=job_id for update;
  if not found or saved.payload->>'last_updated' is distinct from record_updated then return false; end if;
  update public.wedding_rsvps set sheets_sync_status='synced',sheets_synced_at=now() where rsvp_id=job_id;
  update public.wedding_rsvp_outbox set sheets_sync_status='synced',synced_at=now(),lease_token=null,lease_until=null,last_error=null where rsvp_id=job_id;
  return true;
end;
$$;

create function public.host_update_wedding_rsvp(incoming jsonb,expected_revision integer)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare saved public.wedding_rsvps; p jsonb;
begin
  select * into saved from public.wedding_rsvps where rsvp_id=incoming->>'rsvp_id' for update;
  if not found or saved.revision<>expected_revision or saved.phone<>incoming->>'phone' then raise unique_violation using message='RSVP Conflict'; end if;
  p=incoming || jsonb_build_object('created_at',saved.payload->>'created_at','submission_date',saved.payload->>'submission_date','submission_time',saved.payload->>'submission_time');
  update public.wedding_rsvps set guest_name=p->>'guest_name',guest_side=p->>'side',attendance_status=p->>'attending',guest_count=(p->>'guest_count')::integer,
    selected_events=p->'events_attending',arrival_date=case when p->>'attending'='Joyfully Attending' then to_date(p->>'arrival_date','DD FMMonth YYYY') end,
    arrival_time=case when p->>'attending'='Joyfully Attending' then (p->>'arrival_time')::time end,arrival_mode=coalesce(p->>'arrival_mode',''),
    blessing=coalesce(p->>'blessing_message',''),whatsapp_consent=coalesce((p->>'community_consent')::boolean,false),
    payload=p,updated_at=now(),revision=revision+1,sheets_sync_status='pending',sheets_synced_at=null
    where rsvp_id=saved.rsvp_id returning * into saved;
  update public.wedding_rsvp_outbox set payload=p,revision=saved.revision,sheets_sync_status='pending',attempts=0,next_attempt_at=now(),lease_token=null,lease_until=null,last_error=null,synced_at=null where rsvp_id=saved.rsvp_id;
  return jsonb_build_object('record',p,'revision',saved.revision);
end;
$$;
revoke all on function public.take_wedding_request(text,integer,integer),public.ack_wedding_sync(text,text),public.host_update_wedding_rsvp(jsonb,integer) from public,anon,authenticated;
grant execute on function public.take_wedding_request(text,integer,integer),public.ack_wedding_sync(text,text),public.host_update_wedding_rsvp(jsonb,integer) to service_role;

-- Private authoritative store. Apply after 20261027_rsvp_outbox.sql.
create table public.wedding_rsvps (
  id uuid primary key,
  rsvp_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  guest_name text not null check(length(guest_name) between 1 and 120),
  phone text not null unique check(phone ~ '^[1-9][0-9]{9,14}$'),
  guest_side text not null,
  attendance_status text not null check(attendance_status in ('Joyfully Attending','Regretfully Declining')),
  guest_count integer not null check(guest_count between 0 and 10),
  selected_events jsonb not null check(jsonb_typeof(selected_events)='array'),
  arrival_date date,
  arrival_time time,
  arrival_mode text not null default '',
  blessing text not null default '' check(length(blessing)<=2000),
  whatsapp_consent boolean not null default false,
  notification_status text not null default 'pending_manual_dispatch',
  sheets_sync_status text not null default 'pending' check(sheets_sync_status in ('pending','syncing','synced','failed')),
  sheets_synced_at timestamptz,
  payload jsonb not null,
  revision integer not null default 1
);
alter table public.wedding_rsvps enable row level security;
revoke all on public.wedding_rsvps from public,anon,authenticated;
grant all on public.wedding_rsvps to service_role;

alter table public.wedding_rsvp_outbox drop constraint wedding_rsvp_outbox_sheets_sync_status_check;
alter table public.wedding_rsvp_outbox add constraint wedding_rsvp_outbox_sheets_sync_status_check check(sheets_sync_status in ('pending','syncing','synced','failed'));
alter table public.wedding_rsvp_outbox
  add column revision integer not null default 1,
  add column attempts integer not null default 0,
  add column next_attempt_at timestamptz not null default now(),
  add column lease_token uuid,
  add column lease_until timestamptz,
  add column last_error text;
create index wedding_rsvp_sync_due on public.wedding_rsvp_outbox(next_attempt_at) where sheets_sync_status<>'synced';

create or replace function public.accept_wedding_rsvp(incoming jsonb)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare saved public.wedding_rsvps; k text;
begin
  insert into public.wedding_rsvps(id,rsvp_id,guest_name,phone,guest_side,attendance_status,guest_count,selected_events,arrival_date,arrival_time,arrival_mode,blessing,whatsapp_consent,payload)
  values(substring(incoming->>'rsvp_id' from 6)::uuid,incoming->>'rsvp_id',incoming->>'guest_name',incoming->>'phone',incoming->>'side',incoming->>'attending',(incoming->>'guest_count')::integer,incoming->'events_attending',
    case when incoming->>'attending'='Joyfully Attending' then to_date(incoming->>'arrival_date','DD FMMonth YYYY') end,
    case when incoming->>'attending'='Joyfully Attending' then (incoming->>'arrival_time')::time end,
    coalesce(incoming->>'arrival_mode',''),coalesce(incoming->>'blessing_message',''),coalesce((incoming->>'community_consent')::boolean,false),incoming)
  on conflict(rsvp_id) do nothing;
  select * into saved from public.wedding_rsvps where rsvp_id=incoming->>'rsvp_id' for update;
  foreach k in array array['guest_name','phone','side','attending','guest_count','events_attending','arrival_date','arrival_time','arrival_mode','blessing_message','community_consent'] loop
    if saved.payload->k is distinct from incoming->k then raise unique_violation using message='RSVP Conflict'; end if;
  end loop;
  insert into public.wedding_rsvp_outbox(rsvp_id,phone,payload) values(saved.rsvp_id,saved.phone,saved.payload) on conflict(rsvp_id) do nothing;
  return jsonb_build_object('record',saved.payload);
end;
$$;

create function public.claim_wedding_sync()
returns jsonb language plpgsql security invoker set search_path=public as $$
declare job public.wedding_rsvp_outbox;
begin
  select * into job from public.wedding_rsvp_outbox
    where sheets_sync_status<>'synced' and next_attempt_at<=now() and (lease_until is null or lease_until<now())
    order by next_attempt_at for update skip locked limit 1;
  if not found then return null; end if;
  update public.wedding_rsvp_outbox set lease_token=gen_random_uuid(),lease_until=now()+interval '3 minutes',attempts=attempts+1,sheets_sync_status='syncing'
    where rsvp_id=job.rsvp_id returning * into job;
  update public.wedding_rsvps set sheets_sync_status='syncing' where rsvp_id=job.rsvp_id;
  return jsonb_build_object('record',job.payload,'lease_token',job.lease_token,'revision',job.revision);
end;
$$;

create function public.finish_wedding_sync(job_id text,token uuid,job_revision integer,succeeded boolean,error_code text default null)
returns boolean language plpgsql security invoker set search_path=public as $$
declare job public.wedding_rsvp_outbox;
begin
  select * into job from public.wedding_rsvp_outbox where rsvp_id=job_id and lease_token=token and revision=job_revision for update;
  if not found then return false; end if;
  update public.wedding_rsvp_outbox set sheets_sync_status=case when succeeded then 'synced' else 'failed' end,
    synced_at=case when succeeded then now() else synced_at end,
    next_attempt_at=now()+make_interval(secs=>least(3600,60*power(2,least(job.attempts-1,6)))::integer),
    last_error=case when succeeded then null else left(coalesce(error_code,'Synchronization Failed'),80) end,
    lease_token=null,lease_until=null where rsvp_id=job_id;
  update public.wedding_rsvps set sheets_sync_status=case when succeeded then 'synced' else 'failed' end,
    sheets_synced_at=case when succeeded then now() else sheets_synced_at end where rsvp_id=job_id;
  return true;
end;
$$;
revoke all on function public.accept_wedding_rsvp(jsonb),public.claim_wedding_sync(),public.finish_wedding_sync(text,uuid,integer,boolean,text) from public,anon,authenticated;
grant execute on function public.accept_wedding_rsvp(jsonb),public.claim_wedding_sync(),public.finish_wedding_sync(text,uuid,integer,boolean,text) to service_role;

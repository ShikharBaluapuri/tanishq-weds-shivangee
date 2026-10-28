-- Run once in the EXISTING Supabase project, only if Supabase is used.
-- This does not modify, delete, or automatically replay legacy wedding_rsvps.
create table if not exists public.wedding_rsvp_outbox (
  rsvp_id text primary key,
  phone text not null unique,
  payload jsonb not null,
  sheets_sync_status text not null default 'pending' check (sheets_sync_status in ('pending','synced')),
  created_at timestamptz not null default now(),
  synced_at timestamptz
);
alter table public.wedding_rsvp_outbox enable row level security;
revoke all on public.wedding_rsvp_outbox from anon, authenticated;
grant all on public.wedding_rsvp_outbox to service_role;

create or replace function public.accept_wedding_rsvp(incoming jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare saved public.wedding_rsvp_outbox; k text;
begin
  insert into public.wedding_rsvp_outbox(rsvp_id,phone,payload)
    values(incoming->>'rsvp_id',incoming->>'phone',incoming)
    on conflict(rsvp_id) do nothing;
  select * into saved from public.wedding_rsvp_outbox where rsvp_id=incoming->>'rsvp_id' for update;
  -- A retry must retain the original accepted payload and timestamps. Conflicting
  -- edits require host review; never overwrite an accepted response on a retry.
  foreach k in array array['guest_name','phone','side','attending','guest_count','events_attending','arrival_date','arrival_time','arrival_mode','blessing_message','community_consent'] loop
    if saved.payload->k is distinct from incoming->k then
      raise unique_violation using message='RSVP Conflict';
    end if;
  end loop;
  return jsonb_build_object('record', saved.payload);
end;
$$;
revoke all on function public.accept_wedding_rsvp(jsonb) from public, anon, authenticated;
grant execute on function public.accept_wedding_rsvp(jsonb) to service_role;

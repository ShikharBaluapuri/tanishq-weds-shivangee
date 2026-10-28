create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
create schema if not exists wedding_private;
revoke all on schema wedding_private from public,anon,authenticated;
grant usage on schema wedding_private to service_role;

-- Only this fixed wedding endpoint can receive the narrowly scoped worker token.
create function wedding_private.dispatch_worker()
returns bigint language sql security invoker set search_path='' as $$
  select net.http_post(
    url:='https://tanishqwedsshivangee.vercel.app/api/sync-rsvps',
    headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' ||
      (select decrypted_secret from vault.decrypted_secrets where name='wedding_sync_worker_token')),
    body:='{}'::jsonb,timeout_milliseconds:=100000
  );
$$;
revoke all on function wedding_private.dispatch_worker() from public,anon,authenticated,service_role;

-- A privileged, fixed-purpose bridge is required because service_role cannot
-- access Vault or cron directly. It returns no secret and is not exposed to guests.
create function wedding_private.configure_worker(worker_token text,enabled boolean)
returns boolean language plpgsql security definer set search_path='' as $$
declare secret_id uuid; scheduled_id bigint;
begin
  if worker_token !~ '^[a-f0-9]{64}$' then raise exception 'Invalid worker token'; end if;
  select id into secret_id from vault.secrets where name='wedding_sync_worker_token';
  if secret_id is null then
    perform vault.create_secret(worker_token,'wedding_sync_worker_token','Wedding RSVP sync endpoint token');
  else
    perform vault.update_secret(secret_id,worker_token,'wedding_sync_worker_token','Wedding RSVP sync endpoint token');
  end if;
  select jobid into scheduled_id from cron.job where jobname='wedding-rsvp-sheet-sync';
  if scheduled_id is null then
    scheduled_id=cron.schedule('wedding-rsvp-sheet-sync','* * * * *','select wedding_private.dispatch_worker();');
  end if;
  perform cron.alter_job(scheduled_id,active:=enabled);
  return true;
end;
$$;
revoke all on function wedding_private.configure_worker(text,boolean) from public,anon,authenticated;
grant execute on function wedding_private.configure_worker(text,boolean) to service_role;
create function public.configure_wedding_worker(worker_token text,enabled boolean default false)
returns boolean language sql security invoker set search_path='' as $$
  select wedding_private.configure_worker(worker_token,enabled);
$$;
revoke all on function public.configure_wedding_worker(text,boolean) from public,anon,authenticated;
grant execute on function public.configure_wedding_worker(text,boolean) to service_role;

-- pg_net holds the outgoing authorization header temporarily. Keep it server-only.
revoke all on net.http_request_queue,net._http_response from public,anon,authenticated;

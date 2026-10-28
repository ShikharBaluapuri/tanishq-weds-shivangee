import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { guest } from './apps-script-adapter.js';

test('primary store and queue commit together; leases, backoff, stale completion and RLS', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    for (const name of ['20261027_rsvp_outbox.sql','20261028094142_wedding_primary_sync.sql','20261028140613_wedding_runtime_controls.sql']) {
      await db.exec(await fs.readFile(new URL('../supabase/migrations/'+name,import.meta.url),'utf8'));
    }
    await db.exec('set role service_role');
    const payload=guest();
    const accept=async p=>db.query('select accept_wedding_rsvp($1::jsonb)',[JSON.stringify(p)]);
    await accept(payload); await accept(payload);
    const {rows}=await db.query('select guest_name,arrival_date::text,arrival_time::text,blessing,phone from wedding_rsvps');
    assert.equal(rows.length,1); assert.equal(rows[0].guest_name,payload.guest_name);
    assert.equal(rows[0].blessing,payload.blessing_message);
    assert.equal((await db.query('select count(*)::int as n from wedding_rsvp_outbox')).rows[0].n,1);
    await assert.rejects(accept({...payload,blessing_message:'changed'}),/RSVP Conflict/);
    const claim=async()=> (await db.query('select claim_wedding_sync() as job')).rows[0].job;
    const first=await claim(); assert.ok(first.lease_token); assert.equal(await claim(),null);
    const finish=async(token,success)=> (await db.query('select finish_wedding_sync($1,$2,1,$3,$4) as ok',[payload.rsvp_id,token,success,'Synchronization Failed'])).rows[0].ok;
    assert.equal(await finish('00000000-0000-0000-0000-000000000000',true),false);
    assert.equal(await finish(first.lease_token,false),true); assert.equal(await claim(),null);
    assert.equal((await db.query('select sheets_sync_status from wedding_rsvps')).rows[0].sheets_sync_status,'failed');
    await db.exec("update wedding_rsvp_outbox set next_attempt_at=now()-interval '1 minute'");
    const second=await claim(); assert.notEqual(second.lease_token,first.lease_token);
    assert.equal(await finish(first.lease_token,true),false);
    assert.equal(await finish(second.lease_token,true),true); assert.equal(await claim(),null);
    assert.equal((await db.query('select sheets_sync_status from wedding_rsvps')).rows[0].sheets_sync_status,'synced');
    assert.equal((await db.query("select take_wedding_request('test-hash',1,900) as ok")).rows[0].ok,true);
    assert.equal((await db.query("select take_wedding_request('test-hash',1,900) as ok")).rows[0].ok,false);
    const changed={...payload,blessing_message:'Updated by authenticated host',last_updated:new Date().toISOString()};
    const edited=await db.query('select host_update_wedding_rsvp($1::jsonb,1) as result',[JSON.stringify(changed)]);
    assert.equal(edited.rows[0].result.revision,2);
    assert.equal((await db.query('select sheets_sync_status from wedding_rsvps')).rows[0].sheets_sync_status,'pending');
    assert.equal((await db.query('select ack_wedding_sync($1,$2) as ok',[payload.rsvp_id,payload.last_updated||'old'])).rows[0].ok,false);
    assert.equal((await db.query('select ack_wedding_sync($1,$2) as ok',[payload.rsvp_id,changed.last_updated])).rows[0].ok,true);
    await assert.rejects(db.query('select host_update_wedding_rsvp($1::jsonb,1)',[JSON.stringify(changed)]),/RSVP Conflict/);
    for(const role of ['anon','authenticated']) {
      await db.exec(`reset role; set role ${role}`);
      await assert.rejects(db.query('select * from wedding_rsvps'),/permission denied/);
      await assert.rejects(claim(),/permission denied/);
    }
  } finally { await db.close(); }
});

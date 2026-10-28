import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { guest } from './apps-script-adapter.js';

test('real PostgreSQL migration: idempotency, durable payload, phone conflict, and anonymous access denial',async()=>{
  const db=new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    const migration=await fs.readFile(new URL('../supabase/migrations/20261027_rsvp_outbox.sql',import.meta.url),'utf8');
    await db.exec(migration); await db.exec(migration);
    await db.exec('set role service_role');
    const original=guest({submission_date:'27 October 2026',submission_time:'7:30 PM IST',last_updated:'2026-10-27T19:30:00+05:30'});
    const accept=payload=>db.query('select public.accept_wedding_rsvp($1::jsonb) as result',[JSON.stringify(payload)]);
    await Promise.all([accept(original),accept(original),accept(original)]);
    const count=await db.query('select count(*) from wedding_rsvp_outbox'); assert.equal(Number(count.rows[0].count),1);
    const retried=await accept({...original,submission_date:'28 October 2026'});
    assert.equal(retried.rows[0].result.record.submission_date,'27 October 2026');
    await assert.rejects(accept({...original,blessing_message:'Changed after acceptance'}),/RSVP Conflict/);
    await assert.rejects(accept(guest()),/unique constraint/);
    const saved=await db.query('select payload,sheets_sync_status from wedding_rsvp_outbox');
    assert.deepEqual(saved.rows[0].payload,original); assert.equal(saved.rows[0].sheets_sync_status,'pending');
    for (const role of ['anon','authenticated']) {
      await db.exec(`reset role; set role ${role}`);
      await assert.rejects(db.query('select * from public.wedding_rsvp_outbox'),/permission denied/);
      await assert.rejects(accept(original),/permission denied/);
    }
  } finally { await db.close(); }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import rsvp from '../api/rsvp.js';
import retry from '../api/retry-sync.js';
import health from '../api/test-sheets.js';
import { scriptAdapter, configureTestEnvironment, guest, responseRecorder, TEST_SECRET } from './apps-script-adapter.js';

// HTTP contract adapter, not a PostgreSQL engine. The migration still needs staging validation.
function databaseAdapter(google) {
  const rows = new Map();
  const state = { rows, unavailable: false, markFailure: false };
  state.fetch = async (url, options = {}) => {
    if (url.startsWith('https://script.google.com/')) return google.fetch(url, options);
    assert.ok(url.startsWith('https://database.example.invalid/rest/v1/'));
    assert.equal(new Headers(options.headers).get('apikey'), 'test-only-service-role');
    if (state.unavailable) return Response.json({}, {status:503});
    if (url.endsWith('/rpc/take_wedding_request')) return Response.json(true);
    if (url.endsWith('/rpc/ack_wedding_sync')) {
      if(state.markFailure)return Response.json({}, {status:503});
      const {job_id}=JSON.parse(options.body);rows.get(job_id).sheets_sync_status='synced';return Response.json(true);
    }
    if (url.endsWith('/rpc/accept_wedding_rsvp')) {
      const { incoming } = JSON.parse(options.body);
      const previous = rows.get(incoming.rsvp_id);
      if ([...rows.values()].some(row => row.payload.phone === incoming.phone && row.payload.rsvp_id !== incoming.rsvp_id)) return Response.json({}, {status:409});
      if (previous && previous.payload.blessing_message !== incoming.blessing_message) return Response.json({}, {status:409});
      if (!previous) rows.set(incoming.rsvp_id, {payload:incoming,sheets_sync_status:'pending'});
      return Response.json({record:rows.get(incoming.rsvp_id).payload});
    }
    if (options.method === 'PATCH') {
      if (state.markFailure) return Response.json({}, {status:503});
      const id = new URL(url).searchParams.get('rsvp_id').slice(3);
      rows.get(id).sheets_sync_status = 'synced'; return new Response(null,{status:204});
    }
    return Response.json([...rows.values()].filter(r => !url.includes('sheets_sync_status=eq.pending') || r.sheets_sync_status === 'pending'));
  };
  return state;
}
function headers() {
  const time=String(Date.now()); return {authorization:`Bearer ${time}.${crypto.createHmac('sha256',TEST_SECRET).update(time).digest('hex')}`};
}
async function call(handler, body = {}, authenticated = false) {
  const res=responseRecorder(); await handler({method:'POST',body,headers:authenticated ? headers() : {}},res); return res;
}
function setup(t) {
  configureTestEnvironment(); process.env.SUPABASE_URL='https://database.example.invalid'; process.env.SUPABASE_SERVICE_ROLE_KEY='test-only-service-role';
  const google=scriptAdapter(); const db=databaseAdapter(google); t.mock.method(globalThis,'fetch',db.fetch); return {google,db};
}
test('database accepts before Sheets; outage returns pending, host retry verifies exactly one row',async t=>{
  const {google,db}=setup(t); google.failWrite=true; const payload=guest();
  const result=await call(rsvp,payload); assert.equal(result.statusCode,202); assert.equal(result.body.status,'pending');
  assert.equal(db.rows.size,1); assert.equal(google.rows.length,1);
  google.failWrite=false;
  assert.equal((await call(health,{},true)).body.status,'Synchronization Pending');
  const retried=await call(retry,{action:'sheets'},true); assert.equal(retried.statusCode,200);
  assert.equal(retried.body.processedCount,1); assert.equal(google.rows.length,2);
  assert.equal(db.rows.get(payload.rsvp_id).sheets_sync_status,'synced');
  assert.equal((await call(retry,{action:'sheets'},true)).body.processedCount,0);
});
test('database failure never falls through to a Sheets-only acceptance',async t=>{
  const {google,db}=setup(t); db.unavailable=true;
  assert.equal((await call(rsvp,guest())).statusCode,503); assert.equal(google.writes,0);
});
test('lost outbox acknowledgement stays pending and retry does not duplicate the sheet',async t=>{
  const {google,db}=setup(t); db.markFailure=true; const payload=guest();
  assert.equal((await call(rsvp,payload)).statusCode,202); assert.equal(google.rows.length,2);
  db.markFailure=false; assert.equal((await call(retry,{action:'sheets'},true)).statusCode,200); assert.equal(google.rows.length,2);
});
test('partial database configuration fails closed',async t=>{
  const {google}=setup(t); delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert.equal((await call(rsvp,guest())).statusCode,503); assert.equal(google.writes,0);
});

test('modern server secret key persists an RSVP without a legacy key', async t => {
  const { db } = setup(t);
  process.env.SUPABASE_SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const result = await call(rsvp, guest());
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.sync.supabase, true);
  assert.equal(db.rows.size, 1);
});

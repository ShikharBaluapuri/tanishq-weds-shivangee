import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import rsvp from '../api/rsvp.js';
import health from '../api/test-sheets.js';
import retry from '../api/retry-sync.js';
import admin from '../api/admin-rsvps.js';
import verifyPin from '../api/verify-pin.js';
import { verifySession } from '../server/auth.js';
import { sheetsRequest, SPREADSHEET_ID } from '../server/sheets.js';
import { validateSubmission } from '../server/validation.js';
import { sendRsvp } from '../src/services/rsvpClient.js';
import { databaseAdapter } from './database-adapter.js';
import { scriptAdapter, configureTestEnvironment, guest, responseRecorder, TEST_SECRET } from './apps-script-adapter.js';

function hostHeaders() {
  const time = String(Date.now());
  return { authorization: `Bearer ${time}.${crypto.createHmac('sha256', TEST_SECRET).update(time).digest('hex')}` };
}
async function call(handler, body, headers = {}, method = 'POST') {
  const res = responseRecorder(); await handler({ method, body, headers }, res); return res;
}

test('actual handler + Apps Script: attending, all fields, RAW formula safety, IST, independent read-back and retry', async t => {
  configureTestEnvironment(); const google = scriptAdapter(); t.mock.method(globalThis, 'fetch', databaseAdapter(google));
  const payload = guest(); const first = await call(rsvp, payload);
  assert.equal(first.statusCode, 200); assert.equal(first.body.status, 'saved');
  const row = google.rows[1];
  assert.equal(row[0], payload.rsvp_id); assert.equal(row[3], payload.guest_name); assert.equal(row[4], payload.phone);
  assert.equal(row[5], payload.side); assert.equal(row[6], payload.attending); assert.equal(row[7], '2');
  assert.equal(row[8], payload.events_attending.join('; ')); assert.equal(row[9], payload.arrival_date);
  assert.equal(row[10], payload.arrival_time); assert.equal(row[11], payload.blessing_message);
  assert.equal(row[12], 'Not Opted In'); assert.match(row[2], /IST$/); assert.match(row[15], /\+05:30$/);
  assert.ok(google.reads >= 2); const timestamp = row.slice(1,3);
  await call(rsvp, payload); assert.equal(google.rows.length, 2); assert.deepEqual(google.rows[1].slice(1,3), timestamp);
});

test('declining clears count/functions/arrival but preserves blessing', async t => {
  configureTestEnvironment(); const google = scriptAdapter(); t.mock.method(globalThis, 'fetch', databaseAdapter(google));
  const result = await call(rsvp, guest({ attending: 'Regretfully Declining' }));
  assert.equal(result.statusCode, 200); assert.equal(google.rows[1][7], '0'); assert.equal(google.rows[1][8], '');
  assert.equal(google.rows[1][9], 'Not Attending'); assert.equal(google.rows[1][10], ''); assert.match(google.rows[1][11], /^=HYPERLINK/);
});

test('lost response after commit safely retries without duplicate rows', async t => {
  configureTestEnvironment(); const google = scriptAdapter(); google.loseResponse = true; t.mock.method(globalThis, 'fetch', databaseAdapter(google));
  const result = await call(rsvp, guest()); assert.equal(result.statusCode, 200); assert.equal(google.rows.length, 2);
});

test('Sheets errors preserve durable acceptance as pending', async t => {
  configureTestEnvironment(); const google = scriptAdapter(); t.mock.method(globalThis, 'fetch', databaseAdapter(google));
  for (const mode of ['failWrite','failRead','inaccessible','mismatch']) {
    google.rows.splice(1); t.mock.method(globalThis, 'fetch', databaseAdapter(google)); google[mode] = true; const result = await call(rsvp, guest());
    assert.equal(result.statusCode, 202, mode); assert.equal(result.body.status, 'pending'); google[mode] = false;
  }
});

test('same phone with another ID is rejected without overwriting a guest', async t => {
  configureTestEnvironment(); const google = scriptAdapter(); t.mock.method(globalThis, 'fetch', databaseAdapter(google));
  await call(rsvp, guest()); const row = google.rows[1].slice();
  assert.equal((await call(rsvp, guest({ guest_name: 'Other guest' }))).statusCode, 409);
  assert.deepEqual(google.rows[1], row);
});

test('signed webhook rejects bad signature, expired request, wrong destination and HTML success pages', async () => {
  configureTestEnvironment(); const google = scriptAdapter();
  assert.equal(google.invoke({ message: '{}', signature: 'bad' }).success, false);
  const message = JSON.stringify({ action: 'health', timestamp: 1 });
  assert.equal(google.invoke({ message, signature: crypto.createHmac('sha256', TEST_SECRET).update(message).digest('hex') }).success, false);
  let posts=0;
  const legacy=async (_,options)=>{if(options.method==='POST')posts++;return Response.json({success:true,spreadsheet_id:SPREADSHEET_ID,worksheet:'Sheet1'});};
  await assert.rejects(sheetsRequest('health', {}, legacy), /Deployment Version Mismatch/);
  assert.equal(posts,0,'Legacy endpoints must never receive a POST');
  await assert.rejects(sheetsRequest('health', {}, async () => new Response('<html>Sign in</html>')), /Deployment Version Mismatch/);
  const mockReply=reply=>async(_,options)=>options.method==='GET'?Response.json({protocol:'wedding-rsvp-v2'}):Response.json(reply);
  await assert.rejects(sheetsRequest('health', {}, mockReply({success:true,protocol:'wedding-rsvp-v2',action:'health',request_id:'wrong',spreadsheet_id:SPREADSHEET_ID,worksheet:'Sheet1'})), /Deployment Version Mismatch/);
  await assert.rejects(sheetsRequest('health', {}, mockReply({success:false})), /Synchronization Failed/);
  await assert.rejects(sheetsRequest('health', {}, mockReply(null)), /Synchronization Failed/);
});

test('signed wire message is ASCII while Unicode guest data survives JSON parsing',async()=>{
  configureTestEnvironment();const google=scriptAdapter();
  const response=await sheetsRequest('health',{diagnostic:'हिन्दी — 🌸'},async(url,options)=>{
    if(options.method==='POST') {
      const envelope=JSON.parse(options.body);
      assert.equal(/[^\x00-\x7f]/.test(envelope.message),false);
      assert.equal(JSON.parse(envelope.message).payload.diagnostic,'हिन्दी — 🌸');
    }
    return google.fetch(url,options);
  });
  assert.equal(response.success,true);
});

test('health is authenticated, read-only, validates API access; malformed/future/expired sessions fail closed', async t => {
  configureTestEnvironment(); const google = scriptAdapter(); t.mock.method(globalThis, 'fetch', databaseAdapter(google));
  assert.equal((await call(health, {})).statusCode, 401);
  assert.equal((await call(health, {}, hostHeaders())).body.status, 'Connected'); assert.equal(google.writes, 0);
  google.editable = false; assert.equal((await call(health, {}, hostHeaders())).body.status, 'Spreadsheet Not Accessible');
  for (const timestamp of [Date.now()+86400000, Date.now()-90000000]) {
    const signature = crypto.createHmac('sha256', TEST_SECRET).update(String(timestamp)).digest('hex');
    assert.equal(verifySession({headers:{authorization:`Bearer ${timestamp}.${signature}`}}), false);
  }
  assert.equal(verifySession({headers:{authorization:'Bearer 123.x'}}), false);
});

test('host dashboard reads primary database; unauthenticated access is denied', async t => {
  configureTestEnvironment(); const google = scriptAdapter(); t.mock.method(globalThis, 'fetch', databaseAdapter(google));
  await call(rsvp, guest());
  const result = await call(admin, {}, hostHeaders(), 'GET'); assert.equal(result.statusCode, 200);
  assert.equal(result.body.rsvps.length, 1); assert.equal(result.body.status.spreadsheetId, SPREADSHEET_ID);
  assert.equal((await call(admin, {}, {}, 'GET')).statusCode, 401);
  assert.equal((await call(retry, {webhookUrl:'https://example.invalid'}, hostHeaders())).statusCode, 200);
});

test('server rejects malformed data before external requests', async () => {
  for (const changes of [{guest_name: {}},{phone:'abc'},{guest_count: 1.5},{events_attending:[]},{arrival_date:'31 February 2027'},{arrival_time:'25:00 PM'},{rsvp_id:'RSVP-------------------------------------'},{community_consent:'false'}]) {
    assert.throws(() => validateSubmission(guest(changes)));
    assert.equal((await call(rsvp, guest(changes))).statusCode, 400);
  }
  assert.equal((await call(rsvp, '{invalid')).statusCode, 400);
  assert.equal((await call(rsvp, {}, {}, 'GET')).statusCode, 405);
});

test('client prevents false success and retains ID across retry, including blocked browser storage', async () => {
  const sent = []; const badStorage = { getItem(){throw Error();}, setItem(){throw Error();} };
  const payload = guest({ phone: '919000000099' });
  const fetcher = async (_, options) => { sent.push(JSON.parse(options.body)); return Response.json({success:true}); };
  await assert.rejects(sendRsvp(payload, {storage:badStorage,fetcher}), /Unable to confirm/);
  await assert.rejects(sendRsvp(payload, {storage:badStorage,fetcher}), /Unable to confirm/);
  assert.equal(sent[0].rsvp_id, sent[1].rsvp_id);
  await assert.rejects(sendRsvp(guest({phone:'919000000098'}), {storage:badStorage,fetcher}), /Unable to confirm/);
  assert.notEqual(sent[0].rsvp_id, sent[2].rsvp_id);
});

test('host login requires configured secret and returns usable authenticated session', async t => {
  configureTestEnvironment(); t.mock.method(globalThis,'fetch',databaseAdapter(scriptAdapter())); const response = await call(verifyPin, {pin:'local-test-pin'});
  assert.equal(response.statusCode, 200); assert.equal(verifySession({headers:{authorization:`Bearer ${response.body.token}`}}), true);
  delete process.env.SESSION_SECRET; assert.equal((await call(verifyPin, {pin:'local-test-pin'})).statusCode,503);
});

test('simultaneous identical client submits share one request; conflicting in-flight edits are blocked', async () => {
  let resolve, requests=0;
  const payload=guest({phone:'919000000097'});
  const fetcher=(_,options)=>{ requests++; return new Promise(done=>{resolve=()=>{const data=JSON.parse(options.body);done(Response.json({success:true,status:'saved',data,sync:{googleSheets:true}}));};}); };
  const first=sendRsvp(payload,{fetcher});
  await new Promise(done=>{setTimeout(done,20);});
  const second=sendRsvp(payload,{fetcher});
  await assert.rejects(sendRsvp({...payload,blessing_message:'different'},{fetcher}),/still saving/);
  resolve(); await Promise.all([first,second]); assert.equal(requests,1);
});

test('header mismatch and duplicate existing IDs fail without overwriting production-shaped rows',async t=>{
  configureTestEnvironment(); const google=scriptAdapter(); t.mock.method(globalThis,'fetch',databaseAdapter(google));
  const original=google.rows[0][0]; google.rows[0][0]='Unexpected header';
  assert.equal((await call(rsvp,guest())).statusCode,202); assert.equal(google.writes,0);
  google.rows[0][0]=original; t.mock.method(globalThis,'fetch',databaseAdapter(google)); const payload=guest(); await call(rsvp,payload);
  google.rows.push(google.rows[1].slice());
  assert.equal((await call(rsvp,payload)).statusCode,202); assert.equal(google.rows.length,3);
});

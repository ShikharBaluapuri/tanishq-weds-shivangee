import test from 'node:test';
import assert from 'node:assert/strict';
import { processSyncJob } from '../server/sync-worker.js';
import worker from '../api/sync-rsvps.js';
import { responseRecorder } from './apps-script-adapter.js';

test('worker records success only after verified write and retains failure for durable retry', async () => {
  const job={record:{rsvp_id:'test'},lease_token:'lease',revision:1};
  for (const failed of [false,true]) {
    const order=[];
    const result=await processSyncJob({claim:async()=>job,save:async()=>{order.push('save');if(failed)throw Error('private provider body');},finish:async(j,ok,code)=>{order.push('finish');assert.equal(j,job);assert.equal(ok,!failed);assert.equal(code,failed?'Synchronization Failed':null);return true;}});
    assert.deepEqual(order,['save','finish']);assert.equal(result.synchronized,!failed);
  }
  assert.equal((await processSyncJob({claim:async()=>null})).processedCount,0);
});

test('worker rejects unauthenticated calls before accessing database',async()=>{
  process.env.SYNC_WORKER_SECRET='test-only-worker-secret-at-least-32-characters';
  const res=responseRecorder(); await worker({method:'POST',headers:{}},res);
  assert.equal(res.statusCode,401);
  delete process.env.SYNC_WORKER_SECRET;
});

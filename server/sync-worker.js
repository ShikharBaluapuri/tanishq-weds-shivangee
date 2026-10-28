import { claimSync, finishSync } from './store.js';
import { saveAndVerify } from './sheets.js';

// One bounded job per invocation. Expired database leases recover interrupted runs.
export async function processSyncJob({ claim = claimSync, finish = finishSync, save = saveAndVerify } = {}) {
  const job = await claim();
  if (!job) return { processedCount: 0, synchronized: false };
  let succeeded = false;
  try {
    await save(job.record);
    succeeded = true;
  } catch {
    // Guest values and provider error bodies never enter operational logs.
    console.error(JSON.stringify({ event: 'sheets_worker_failed', code: 'Synchronization Failed' }));
  }
  const recorded = await finish(job, succeeded, succeeded ? null : 'Synchronization Failed');
  if (!recorded) throw new Error('Lease superseded');
  return { processedCount: 1, synchronized: succeeded };
}

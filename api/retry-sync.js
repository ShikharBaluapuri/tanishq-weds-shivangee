import { verifySession } from '../server/auth.js';
import { databaseConfigured, listRecords, markSynced } from '../server/store.js';
import { saveAndVerify } from '../server/sheets.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ success: false });
  if (!verifySession(req)) return res.status(401).json({ success: false, error: 'Host authentication required.' });
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}; }
  catch { return res.status(400).json({ success: false, error: 'Invalid JSON.' }); }
  if (!['sheets', 'all'].includes(body.action || 'sheets')) return res.status(400).json({ success: false, error: 'This endpoint retries spreadsheet synchronization only.' });
  if (body.rsvp_id && !/^RSVP-[0-9a-f-]{36}$/.test(body.rsvp_id)) return res.status(400).json({ success: false, error: 'Invalid RSVP ID.' });
  try {
    if (!databaseConfigured()) return res.status(409).json({ success: false, error: 'No durable retry queue is configured. Unconfirmed guests must retry their original submission.' });
    // One record per request keeps retries bounded below the function timeout.
    const pending = await listRecords({ pending: true, id: body.rsvp_id || null });
    const record = pending[0];
    if (!record) return res.status(200).json({ success: true, processedCount: 0, remainingCount: 0 });
    await saveAndVerify(record);
    await markSynced(record.rsvp_id,record.last_updated);
    return res.status(200).json({ success: true, processedCount: 1, remainingCount: pending.length - 1 });
  } catch (error) {
    console.error(JSON.stringify({ event: 'rsvp_retry_failed', code: error.code || 'Synchronization Failed' }));
    return res.status(503).json({ success: false, error: 'Synchronization failed. The accepted RSVP remains saved for another retry.' });
  }
}

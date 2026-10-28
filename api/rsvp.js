import { validateSubmission } from '../server/validation.js';
import { saveAndVerify } from '../server/sheets.js';
import { databaseConfigured, acceptRecord, markSynced } from '../server/store.js';
import { rateLimit, sameOrigin } from '../server/request-controls.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  if (!sameOrigin(req)) return res.status(403).json({success:false,error:'Invalid request origin.'});
  let record;
  try { record = validateSubmission(typeof req.body === 'string' ? JSON.parse(req.body) : req.body); }
  catch (error) { return res.status(400).json({ success: false, error: error instanceof SyntaxError ? 'Invalid JSON.' : error.message }); }
  const now = new Date();
  Object.assign(record, {
    submission_date: now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }),
    submission_time: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) + ' IST',
    last_updated: new Date(now.getTime() + 330 * 60000).toISOString().replace('Z', '+05:30'),
    created_at: now.toISOString(), whatsapp_notify_status: 'pending_manual_dispatch'
  });
  let durable = false;
  try {
    if (!databaseConfigured()) throw Object.assign(new Error('Database Configuration Missing'), {code:'Database Configuration Missing'});
    if (!await rateLimit(req,'rsvp-ip',null,30) || !await rateLimit(req,'rsvp-phone',record.phone,10)) return res.status(429).json({success:false,error:'Too many submissions. Please wait before trying again.'});
    record = await acceptRecord(record);
    durable = true;
    const saved = await saveAndVerify(record);
    if (durable) await markSynced(record.rsvp_id,record.last_updated);
    console.info(JSON.stringify({ event: 'rsvp_saved', sheets: 'verified', durable }));
    return res.status(200).json({ success: true, status: 'saved', data: saved, sync: { googleSheets: true, supabase: durable } });
  } catch (error) {
    console.error(JSON.stringify({ event: 'rsvp_save_failed', code: error.code || 'Synchronization Failed' }));
    if (durable) return res.status(202).json({ success: true, status: 'pending', data: { ...record, sheets_sync_status: 'pending' }, sync: { googleSheets: false, supabase: true } });
    if (error.code === 'RSVP Conflict') return res.status(409).json({ success: false, error: 'An RSVP already exists for this submission or number. Please contact the hosts to make changes.' });
    return res.status(503).json({ success: false, error: 'We could not confirm your RSVP was saved. Please retry; your submission ID will stay the same.' });
  }
}

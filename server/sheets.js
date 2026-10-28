import crypto from 'node:crypto';
export const SPREADSHEET_ID = '1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y';
export const WORKSHEET = 'Sheet1';
export const PROTOCOL = 'wedding-rsvp-v2';
export class IntegrationError extends Error {
  constructor(code) { super(code); this.code = code; }
}
export async function sheetsRequest(action, payload = {}, fetcher = fetch) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!url || !secret || secret.length < 32 || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)) throw new IntegrationError('Configuration Missing');
  // Read-only deployment handshake BEFORE any POST. The legacy endpoint appended
  // unknown request shapes, including health checks, so never probe it with POST.
  try {
    const probe = await fetcher(url, {method:'GET',signal:AbortSignal.timeout(8000)});
    const identity = await probe.json();
    if (!probe.ok || identity?.protocol !== PROTOCOL) throw new Error();
  } catch { throw new IntegrationError('Deployment Version Mismatch'); }
  const nonce=crypto.randomUUID();
  // Keep the signed envelope ASCII on the wire. JSON.parse restores guest Unicode
  // exactly; this avoids charset-dependent HMAC differences in Apps Script.
  const message = JSON.stringify({ action, payload, timestamp: Date.now(), nonce }).replace(/[\u007f-\uffff]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));
  const signature = crypto.createHmac('sha256', secret).update(message).digest('hex');
  let response;
  try {
    response = await fetcher(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify({ message, signature }), signal: AbortSignal.timeout(12000) });
  } catch { throw new IntegrationError('Synchronization Failed'); }
  if ([401, 403].includes(response.status)) throw new IntegrationError('Authentication Failed');
  if (!response.ok) throw new IntegrationError('Synchronization Failed');
  let result;
  try { result = await response.json(); } catch { throw new IntegrationError('Authentication Failed'); }
  if (!result || typeof result !== 'object') throw new IntegrationError('Synchronization Failed');
  if (!result.success) throw new IntegrationError(['Authentication Failed', 'Spreadsheet Not Accessible', 'Header Mismatch', 'RSVP Conflict'].includes(result.error) ? result.error : 'Synchronization Failed');
  if (result.protocol !== PROTOCOL || result.action !== action || result.request_id !== nonce) throw new IntegrationError('Deployment Version Mismatch');
  if (result.spreadsheet_id !== SPREADSHEET_ID || result.worksheet !== WORKSHEET) throw new IntegrationError('Spreadsheet Not Accessible');
  return result;
}
export async function saveAndVerify(record, request = sheetsRequest) {
  // Cross-instance locking is held in Apps Script; the same ID survives retries.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const saved = await request('save', record);
      if (saved.rsvp_id !== record.rsvp_id) throw new IntegrationError('RSVP Conflict');
      const read = await request('read', { rsvp_id: record.rsvp_id });
      if (read.matches !== 1 || !Array.isArray(read.values) || read.values.length !== 17 || JSON.stringify(read.values) !== JSON.stringify(saved.values)) throw new IntegrationError('Synchronization Failed');
      const expected = [record.rsvp_id, record.submission_date, record.submission_time, record.guest_name, record.phone, record.side, record.attending, String(record.guest_count), record.events_attending.join('; '), record.arrival_date, record.arrival_time, record.blessing_message, record.community_consent ? 'Opted In' : 'Not Opted In', 'Pending Manual Dispatch', 'Synced', record.last_updated, record.arrival_mode || ''];
      for (const i of [0,3,4,5,6,7,8,9,10,11,12,13,14,15,16]) {
        if (String(read.values[i]) !== expected[i]) throw new IntegrationError('Synchronization Failed');
      }
      return { ...record, submitted_at: `${read.values[1]} ${read.values[2]}`, submission_date: read.values[1], submission_time: read.values[2], sheets_sync_status: 'synced' };
    } catch (error) { if (attempt || error.code !== 'Synchronization Failed') throw error; }
  }
}

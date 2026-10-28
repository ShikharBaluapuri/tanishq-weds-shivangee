import { verifySession } from '../server/auth.js';
import { sheetsRequest } from '../server/sheets.js';
import { databaseConfigured, listPrimaryRecords } from '../server/store.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ success: false });
  if (!verifySession(req)) return res.status(401).json({ success: false, error: 'Host authentication required.' });
  try {
    await sheetsRequest('health');
    if (!databaseConfigured()) return res.status(503).json({success:false,status:'Configuration Missing'});
    const records=await listPrimaryRecords();
    if (records.some(r=>r.sheets_sync_status==='failed')) return res.status(200).json({success:true,status:'Synchronization Failed',message:'Authorized spreadsheet access verified. Saved records are waiting for retry.'});
    if (records.some(r=>r.sheets_sync_status!=='synced')) return res.status(200).json({ success: true, status: 'Synchronization Pending', message: 'Spreadsheet access verified. Saved RSVPs are waiting for synchronization.' });
    return res.status(200).json({ success: true, status: 'Connected', message: 'Connected: authorized access to the exact spreadsheet and Sheet1 verified. No test row was written.' });
  } catch (error) {
    return res.status(503).json({ success: false, status: error.code || 'Synchronization Failed', error: error.code || 'Synchronization Failed' });
  }
}

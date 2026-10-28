import { verifySession } from '../server/auth.js';
import { sheetsRequest, SPREADSHEET_ID, WORKSHEET } from '../server/sheets.js';
import { databaseConfigured, listPrimaryRecords } from '../server/store.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ success: false });
  if (!verifySession(req)) return res.status(401).json({ error: 'Host authentication required.' });
  let rsvps = [], connected = false, connectionStatus = 'Synchronization Failed', durable = false;
  try {
    durable = databaseConfigured();
    if (!durable) return res.status(503).json({success:false,error:'Database Configuration Missing'});
    rsvps = await listPrimaryRecords();
    await sheetsRequest('health');
    connected = true;
    connectionStatus = rsvps.some(r => r.sheets_sync_status !== 'synced') ? 'Synchronization Pending' : 'Connected';
  } catch (error) {
    connectionStatus = error.code || 'Synchronization Failed';
    if (!durable || connectionStatus === 'Database Unavailable') return res.status(503).json({ success: false, error: connectionStatus });
  }
  const communityUrl = process.env.WHATSAPP_COMMUNITY_URL || process.env.VITE_WHATSAPP_COMMUNITY_URL || '';
  // Calculate detailed integration metrics
  const totalRsvps = rsvps.length;
  const attendingRsvps = rsvps.filter(r => r.attending === 'Joyfully Attending');
  const declinedRsvps = rsvps.filter(r => r.attending === 'Regretfully Declining');
  const totalHeadcount = attendingRsvps.reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);

  const baluapuriList = rsvps.filter(r => (r.side || '').toLowerCase().includes('baluapuri'));
  const kushwahList = rsvps.filter(r => (r.side || '').toLowerCase().includes('kushwah') || (r.side || '').toLowerCase().includes('verma'));
  const friendsList = rsvps.filter(r => !baluapuriList.includes(r) && !kushwahList.includes(r));

  const sheetsSynced = rsvps.filter(r => r.sheets_sync_status === 'synced').length;
  const sheetsPending = rsvps.filter(r => r.sheets_sync_status !== 'synced').length;

  const whatsappSent = rsvps.filter(r => r.whatsapp_notify_status === 'sent').length;
  const whatsappPendingManual = rsvps.filter(r => r.whatsapp_notify_status === 'pending_manual_dispatch').length;
  const whatsappFailed = rsvps.filter(r => r.whatsapp_notify_status === 'failed').length;

  const communityOptedIn = rsvps.filter(r => r.community_consent).length;
  const communityOptedOut = totalRsvps - communityOptedIn;

  return res.status(200).json({
    success: true,
    rsvps,
    telemetry: {
      totalRsvps,
      attendingCount: attendingRsvps.length,
      declinedCount: declinedRsvps.length,
      totalHeadcount,
      families: {
        baluapuri: {
          rsvps: baluapuriList.length,
          headcount: baluapuriList.filter(r => r.attending === 'Joyfully Attending').reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0),
          recipient: '+91 9425006278'
        },
        kushwah: {
          rsvps: kushwahList.length,
          headcount: kushwahList.filter(r => r.attending === 'Joyfully Attending').reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0),
          recipient: '+91 8319433078'
        },
        friends: {
          rsvps: friendsList.length,
          headcount: friendsList.filter(r => r.attending === 'Joyfully Attending').reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0),
          recipient: process.env.WHATSAPP_FRIENDS_RECIPIENT || '+91 9425006278'
        }
      },
      sync: {
        sheetsSynced,
        sheetsPending,
        whatsappSent,
        whatsappPendingManual,
        whatsappFailed,
        communityOptedIn,
        communityOptedOut
      }
    },
    status: {
      googleSheetsConfigured: connected,
      connectionStatus,
      supabaseConfigured: durable,
      whatsappAutomatedConfigured: false,
      whatsappCommunityConfigured: Boolean(communityUrl),
      whatsappCommunityUrl: communityUrl,
      spreadsheetName: 'T&S Wedding RSVPs',
      spreadsheetId: '1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y',
      spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y/edit',
      worksheetName: 'Sheet1'
    }
  });
}

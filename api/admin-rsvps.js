// Vercel Serverless Function: Protected Host Admin RSVP & Integrations Telemetry Endpoint
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function verifySession(req) {
  const authHeader = req.headers.authorization || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookieHeader = req.headers.cookie || '';
    const match = cookieHeader.match(/host_session=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  if (!token || !token.includes('.')) return false;

  const [timestamp, hmac] = token.split('.');
  const time = Number(timestamp);
  if (!time || isNaN(time)) return false;

  // Session expiry: 24 hours
  if (Date.now() - time > 24 * 60 * 60 * 1000) return false;

  const secret = process.env.SESSION_SECRET || 'wedding-tanishq-shivangee-secure-salt-2027';
  const expectedHmac = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
}

const DATA_FILE = path.join(process.cwd(), '.data', 'rsvps.json');

export default async function handler(req, res) {
  // Check authorization
  if (!verifySession(req)) {
    return res.status(401).json({
      error: 'Unauthorized: Valid family host session required to access protected guest data.'
    });
  }

  // If Supabase is configured, fetch live cloud records
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  let rsvps = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/wedding_rsvps?select=*&order=created_at.desc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      if (response.ok) {
        rsvps = await response.json();
      }
    } catch (e) {
      console.warn('Supabase fetch failed in admin endpoint:', e.message);
    }
  }

  // Fallback to local server cache
  if (rsvps.length === 0 && fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      rsvps = raw ? JSON.parse(raw) : [];
    } catch {
      rsvps = [];
    }
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';
  const metaToken = process.env.WHATSAPP_API_TOKEN || '';
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
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
      googleSheetsConfigured: Boolean(webhookUrl && webhookUrl.startsWith('https://')),
      supabaseConfigured: Boolean(supabaseUrl && supabaseKey),
      whatsappAutomatedConfigured: Boolean(metaToken && metaPhoneId),
      whatsappCommunityConfigured: Boolean(communityUrl),
      whatsappCommunityUrl: communityUrl,
      spreadsheetName: 'Tanishq & Shivangee — Wedding RSVP 2027',
      driveFolderName: 'Tanishq & Shivangee — Wedding RSVP'
    }
  });
}

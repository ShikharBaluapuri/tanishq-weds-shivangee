// Vercel Serverless Function: Authorized Manual Retry for Google Sheets Sync & WhatsApp Notifications
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

  if (Date.now() - time > 24 * 60 * 60 * 1000) return false;

  const secret = process.env.SESSION_SECRET || 'wedding-tanishq-shivangee-secure-salt-2027';
  const expectedHmac = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
}

const DATA_FILE = path.join(process.cwd(), '.data', 'rsvps.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!verifySession(req)) {
    return res.status(401).json({
      error: 'Unauthorized: Valid host session required to trigger integration retries.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { rsvp_id, action = 'all' } = body || {};

  let rsvps = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      rsvps = raw ? JSON.parse(raw) : [];
    } catch {
      rsvps = [];
    }
  }

  if (rsvps.length === 0) {
    return res.status(404).json({ success: false, error: 'No RSVPs found in storage.' });
  }

  const targets = rsvp_id 
    ? rsvps.filter(r => r.rsvp_id === rsvp_id)
    : rsvps.filter(r => r.sheets_sync_status !== 'synced' || r.whatsapp_notify_status !== 'sent');

  if (targets.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'All records are already fully synchronized.',
      processedCount: 0
    });
  }

  const webhookUrl = body?.webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
  const metaToken = process.env.WHATSAPP_API_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  const results = [];

  for (const record of targets) {
    let sheetsSuccess = record.sheets_sync_status === 'synced';
    let whatsappSuccess = record.whatsapp_notify_status === 'sent';

    // 1. Retry Google Sheets
    if ((action === 'sheets' || action === 'all') && !sheetsSuccess && webhookUrl) {
      try {
        const now = new Date();
        const sheetPayload = {
          rsvp_id: record.rsvp_id,
          submission_date: record.submission_date || now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }),
          submission_time: record.submission_time || now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
          guest_name: record.guest_name,
          phone: record.phone,
          side: record.side,
          attending: record.attending,
          guest_count: record.guest_count,
          events_attending: Array.isArray(record.events_attending) ? record.events_attending.join('; ') : (record.events_attending || ''),
          arrival_date: record.arrival_date,
          arrival_time: record.arrival_time,
          blessing_message: record.blessing_message,
          whatsapp_consent: record.community_consent ? 'Opted In' : 'Not Opted In',
          notification_status: record.whatsapp_notify_status === 'sent' ? 'Delivered' : 'Pending Manual Dispatch',
          sheets_sync_status: 'Synced',
          last_updated: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };

        const sheetRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: JSON.stringify(sheetPayload)
        });

        if (sheetRes.ok) {
          sheetsSuccess = true;
          record.sheets_sync_status = 'synced';
        }
      } catch (e) {
        console.warn('Retry Google Sheets failed:', e.message);
      }
    }

    // 2. Retry WhatsApp Meta Cloud API
    if ((action === 'whatsapp' || action === 'all') && !whatsappSuccess && metaToken && metaPhoneId) {
      try {
        const metaRes = await fetch(`https://graph.facebook.com/v21.0/${metaPhoneId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${metaToken}`
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: record.whatsapp_recipient,
            type: 'text',
            text: {
              preview_url: false,
              body: record.blessing_message 
                ? `🌸 *Tanishq & Shivangee — Wedding RSVP*\n\nGuest: ${record.guest_name}\nSide: ${record.side}\nAttending: ${record.attending}\nGuests: ${record.guest_count}\nRSVP ID: ${record.rsvp_id}`
                : `🌸 *Tanishq & Shivangee — Wedding RSVP*\n\nGuest: ${record.guest_name}\nSide: ${record.side}\nAttending: ${record.attending}\nRSVP ID: ${record.rsvp_id}`
            }
          })
        });

        if (metaRes.ok) {
          whatsappSuccess = true;
          record.whatsapp_notify_status = 'sent';
        }
      } catch (e) {
        console.warn('Retry WhatsApp failed:', e.message);
      }
    }

    record.last_updated = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    results.push({
      rsvp_id: record.rsvp_id,
      guest_name: record.guest_name,
      sheets_synced: sheetsSuccess,
      whatsapp_synced: whatsappSuccess
    });
  }

  // Save back updated file
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Error persisting retried records:', e.message);
  }

  return res.status(200).json({
    success: true,
    processedCount: results.length,
    results
  });
}

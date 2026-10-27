// Vercel Serverless Function: Secure RSVP Ingestion, Google Sheets Sync & WhatsApp Automation
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Sanitize string against spreadsheet formula injection (=, +, -, @)
function sanitizeForSpreadsheet(val) {
  if (typeof val !== 'string') return val;
  const trimmed = val.trim();
  if (/^[=+\-@]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

// Generate stable, human-readable luxury wedding RSVP ID (e.g., RSVP-2027-B7X9Q2)
function generateRsvpId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `RSVP-2027-${code}`;
}

// Canonical Family Routing Numbers
const FAMILY_RECIPIENTS = {
  BALUAPURI: '919425006278', // Dr. Nidhi & Mr. Manish Baluapuri
  KUSHWAH: '918319433078',   // Kushwah Family
  DEFAULT_FRIENDS: '919425006278'
};

function getFamilyRecipient(side) {
  const normalized = (side || '').toLowerCase();
  if (normalized.includes('baluapuri')) {
    return FAMILY_RECIPIENTS.BALUAPURI;
  }
  if (normalized.includes('kushwah') || normalized.includes('verma')) {
    return FAMILY_RECIPIENTS.KUSHWAH;
  }
  const customFriends = process.env.WHATSAPP_FRIENDS_RECIPIENT || '';
  if (customFriends && /^\d{10,14}$/.test(customFriends.replace(/\D/g, ''))) {
    const digits = customFriends.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  }
  return FAMILY_RECIPIENTS.DEFAULT_FRIENDS;
}

function formatFamilyNotification(record) {
  const isAttending = record.attending === 'Joyfully Attending';
  const attendanceText = isAttending ? 'Attending' : 'Declining';
  const events = isAttending && Array.isArray(record.events_attending) && record.events_attending.length > 0
    ? record.events_attending.join(', ')
    : (isAttending ? 'All Wedding Functions' : 'None');
  
  const arrival = isAttending && record.arrival_date
    ? `${record.arrival_date}${record.arrival_time ? ' at ' + record.arrival_time : ''}`
    : (isAttending ? '14–15 February 2027' : 'Not Attending');
    
  const blessing = record.blessing_message && record.blessing_message.trim()
    ? `"${record.blessing_message.trim()}"`
    : 'None';

  return [
    '🌸 *Tanishq & Shivangee — Wedding RSVP*',
    '',
    'A new wedding response has been received!',
    '',
    `*Guest:* ${record.guest_name}`,
    `*Family:* ${record.side}`,
    `*Attendance:* ${attendanceText}`,
    `*Number of Guests:* ${record.guest_count}`,
    `*Functions:* ${events}`,
    `*Arrival:* ${arrival}`,
    `*Blessing:* ${blessing}`,
    `*RSVP ID:* ${record.rsvp_id}`,
    '',
    'Please check the host dashboard for complete details.'
  ].join('\n');
}

// Local persistent file store for fallback/host dashboard
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'rsvps.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf-8');
    }
  } catch {
    // Read-only filesystem handling on certain serverless runtimes
  }
}

function saveLocalRsvp(record) {
  try {
    ensureDataFile();
    if (!fs.existsSync(DATA_FILE)) return;
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const list = raw ? JSON.parse(raw) : [];
    // Deduplicate by RSVP ID or normalized phone
    const filtered = list.filter(item => 
      item.rsvp_id !== record.rsvp_id && 
      item.phone.replace(/\D/g, '') !== record.phone.replace(/\D/g, '')
    );
    filtered.unshift(record);
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Local file cache write skipped:', e.message);
  }
}

function findExistingLocalRsvp(phone, rsvpId) {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const list = raw ? JSON.parse(raw) : [];
    const cleanPhone = (phone || '').replace(/\D/g, '');
    return list.find(item => 
      (rsvpId && item.rsvp_id === rsvpId) || 
      (cleanPhone && item.phone.replace(/\D/g, '') === cleanPhone)
    ) || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid JSON body' });
    }
  }

  const rawGuestName = body?.guest_name || '';
  const rawPhone = body?.phone || '';

  if (!rawGuestName || !rawPhone) {
    return res.status(400).json({ success: false, error: 'Guest name and phone number are required.' });
  }

  const cleanPhone = rawPhone.replace(/\D/g, '');
  const guest_name = sanitizeForSpreadsheet(rawGuestName);
  const phone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const attending = body?.attending || 'Joyfully Attending';
  const guest_count = attending === 'Regretfully Declining' ? 0 : Math.max(1, Number(body?.guest_count) || 1);
  const side = sanitizeForSpreadsheet(body?.side || 'Friends & Colleagues');
  const arrival_date = sanitizeForSpreadsheet(body?.arrival_date || (attending === 'Joyfully Attending' ? '14 February 2027' : 'Not Attending'));
  const arrival_time = sanitizeForSpreadsheet(body?.arrival_time || (attending === 'Joyfully Attending' ? '10:30 AM' : ''));
  const blessing_message = sanitizeForSpreadsheet(body?.blessing_message || '');
  const events_attending = attending === 'Regretfully Declining' 
    ? [] 
    : (Array.isArray(body?.events_attending) ? body.events_attending : []);
  const community_consent = Boolean(body?.community_consent);

  // Check if existing record exists (in-place update / deduplication)
  const existingRecord = findExistingLocalRsvp(phone, body?.rsvp_id);
  const rsvp_id = existingRecord?.rsvp_id || body?.rsvp_id || generateRsvpId();
  const submission_id = existingRecord?.submission_id || crypto.randomUUID();
  const timestampIST = existingRecord?.submitted_at || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const lastUpdatedIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Community Invitation Status tracking
  let community_invite_status = 'not_consented';
  if (attending === 'Regretfully Declining') {
    community_invite_status = community_consent ? 'invitation_available' : 'declined';
  } else {
    community_invite_status = community_consent ? 'invitation_available' : 'not_consented';
  }

  // Target Family Recipient
  const familyRecipient = getFamilyRecipient(side);

  const now = new Date();
  const submissionDate = existingRecord?.submission_date || now.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const submissionTime = existingRecord?.submission_time || now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) + ' IST';

  const record = {
    id: submission_id,
    submission_id,
    rsvp_id,
    submission_date: submissionDate,
    submission_time: submissionTime,
    submitted_at: timestampIST,
    last_updated: lastUpdatedIST,
    guest_name,
    phone: `'${phone}`,
    raw_phone: phone,
    side,
    attending,
    guest_count,
    events_attending,
    arrival_date,
    arrival_time,
    arrival_info: `${arrival_date} ${arrival_time}`.trim(),
    needs_accommodation: 'No',
    blessing_message,
    community_consent,
    community_invite_status,
    whatsapp_notify_status: 'pending_manual_dispatch',
    whatsapp_recipient: familyRecipient,
    sheets_sync_status: 'pending',
    created_at: existingRecord?.created_at || new Date().toISOString()
  };

  // 1. Google Sheets Payload conforming to the exact 16 columns (A to P)
  const sheetPayload = {
    rsvp_id: record.rsvp_id,
    submission_date: record.submission_date,
    submission_time: record.submission_time,
    guest_name: record.guest_name,
    phone: record.phone,
    side: record.side,
    attending: record.attending,
    guest_count: record.guest_count,
    events_attending: record.events_attending.join('; '),
    arrival_date: record.arrival_date,
    arrival_time: record.arrival_time,
    blessing_message: record.blessing_message,
    whatsapp_consent: record.community_consent ? 'Opted In' : 'Not Opted In',
    notification_status: 'Pending Manual Dispatch',
    sheets_sync_status: 'Synced',
    last_updated: record.last_updated
  };

  let syncedToGoogleSheets = false;
  let syncedToSupabase = false;
  let whatsappNotificationSent = false;
  let sheetsError = null;
  let whatsappError = null;

  // 2. Synchronize to Google Sheets
  const webhookUrl = body?.webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
  if (webhookUrl && webhookUrl.startsWith('https://')) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const sheetRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(sheetPayload),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (sheetRes.ok) {
        syncedToGoogleSheets = true;
        record.sheets_sync_status = 'synced';
      } else {
        record.sheets_sync_status = 'failed';
        sheetsError = `Google Apps Script returned status ${sheetRes.status}`;
      }
    } catch (err) {
      console.warn('Google Sheets sync error:', err.message);
      record.sheets_sync_status = 'failed';
      sheetsError = err.message;
    }
  }

  // 3. Primary Database Persistence: Supabase
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const supaRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/wedding_rsvps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify([{
          id: record.submission_id,
          rsvp_id: record.rsvp_id,
          guest_name: record.guest_name,
          phone: record.raw_phone,
          side: record.side,
          attending: record.attending,
          guest_count: record.guest_count,
          events_attending: record.events_attending,
          arrival_info: record.arrival_info,
          arrival_date: record.arrival_date,
          arrival_time: record.arrival_time,
          needs_accommodation: 'No',
          blessing_message: record.blessing_message,
          community_consent: record.community_consent,
          community_invite_status: record.community_invite_status,
          sheets_sync_status: record.sheets_sync_status,
          whatsapp_notify_status: record.whatsapp_notify_status,
          created_at: record.created_at,
          last_updated: record.last_updated
        }]),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (supaRes.ok) {
        syncedToSupabase = true;
      }
    } catch (err) {
      console.warn('Supabase sync error:', err.message);
    }
  }

  // 4. WhatsApp Business Platform Automated Notification (Meta Cloud API)
  const metaToken = process.env.WHATSAPP_API_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  const familyMessageText = formatFamilyNotification(record);

  if (metaToken && metaPhoneId) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const metaRes = await fetch(`https://graph.facebook.com/v21.0/${metaPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${metaToken}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: familyRecipient,
          type: 'text',
          text: {
            preview_url: false,
            body: familyMessageText
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (metaRes.ok) {
        const metaData = await metaRes.json();
        whatsappNotificationSent = true;
        record.whatsapp_notify_status = 'sent';
        record.provider_message_id = metaData?.messages?.[0]?.id || 'meta-sent';
      } else {
        const metaErr = await metaRes.text();
        console.warn('WhatsApp Cloud API returned error:', metaErr);
        record.whatsapp_notify_status = 'failed';
        whatsappError = metaErr;
      }
    } catch (err) {
      console.warn('WhatsApp automated dispatch error:', err.message);
      record.whatsapp_notify_status = 'failed';
      whatsappError = err.message;
    }
  } else {
    // Automated sender not yet provisioned; set status to pending manual dispatch
    record.whatsapp_notify_status = 'pending_manual_dispatch';
  }

  // Generate verified manual click-to-chat fallback URL
  const manualWhatsAppUrl = `https://wa.me/${familyRecipient}?text=${encodeURIComponent(familyMessageText)}`;
  record.manual_whatsapp_url = manualWhatsAppUrl;

  // 5. Cache record in server persistent store
  saveLocalRsvp(record);

  return res.status(200).json({
    success: true,
    data: record,
    sync: {
      googleSheets: syncedToGoogleSheets,
      supabase: syncedToSupabase,
      whatsappAutomated: whatsappNotificationSent,
      whatsappStatus: record.whatsapp_notify_status,
      familyRecipient,
      manualWhatsAppUrl,
      sheetsError,
      whatsappError
    }
  });
}

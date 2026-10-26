// Vercel Serverless Function: Secure RSVP Ingestion & Google Sheets Sync
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
  } catch (e) {
    // Read-only filesystem handling on certain serverless platforms
  }
}

function saveLocalRsvp(record) {
  try {
    ensureDataFile();
    if (!fs.existsSync(DATA_FILE)) return;
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const list = raw ? JSON.parse(raw) : [];
    // Deduplicate by phone
    const filtered = list.filter(item => item.phone !== record.phone);
    filtered.unshift(record);
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Local file cache write skipped:', e.message);
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

  const guest_name = sanitizeForSpreadsheet(body?.guest_name || '');
  const phone = sanitizeForSpreadsheet(body?.phone || '');
  const attending = body?.attending || 'Joyfully Attending';
  const guest_count = attending === 'Regretfully Declining' ? 0 : Math.max(1, Number(body?.guest_count) || 1);
  const side = sanitizeForSpreadsheet(body?.side || 'Friends & Colleagues');
  const arrival_date = sanitizeForSpreadsheet(body?.arrival_date || '14 February 2027');
  const arrival_time = sanitizeForSpreadsheet(body?.arrival_time || '10:30 AM');
  const arrival_info = sanitizeForSpreadsheet(body?.arrival_info || `${body?.arrival_mode || 'Car'} - ${arrival_date} ${arrival_time}`);
  const blessing_message = sanitizeForSpreadsheet(body?.blessing_message || '');
  const events_attending = Array.isArray(body?.events_attending) ? body.events_attending : [];

  if (!guest_name || !phone) {
    return res.status(400).json({ success: false, error: 'Guest name and phone number are required.' });
  }

  // Exact 10 fields for Google Sheet & Wedding Database
  const submission_id = crypto.randomUUID();
  const timestampIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const record = {
    submission_id,
    submitted_at: timestampIST,
    guest_name,
    phone: phone.startsWith('+') ? `'${phone}` : `'${phone}`,
    side,
    attending,
    guest_count,
    arrival_date,
    arrival_time,
    blessing_message,
    events_attending,
    arrival_info,
    needs_accommodation: 'No',
    created_at: new Date().toISOString()
  };

  const hasEvent = (pattern) => events_attending.some(e => pattern.test(e));
  const sheetPayload = {
    submission_id,
    timestamp: timestampIST,
    guest_name,
    phone: record.phone,
    side,
    attending,
    guest_count,
    arrival_date,
    arrival_time,
    blessing_message,
    ganesh_poojan: hasEvent(/Ganesh/i) ? 'YES' : 'NO',
    haldi_carnival: hasEvent(/Haldi/i) ? 'YES' : 'NO',
    sangeet: hasEvent(/Sangeet/i) ? 'YES' : 'NO',
    wedding: hasEvent(/Varmala|Barat|Wedding/i) ? 'YES' : 'NO',
    arrival_info,
    needs_accommodation: 'No'
  };

  let syncedToGoogleSheets = false;
  let syncedToSupabase = false;
  let syncError = null;

  // 1. Sync to Google Sheets Webhook if configured
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
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
      }
    } catch (err) {
      console.warn('Google Sheets Webhook sync error:', err.message);
      syncError = err.message;
    }
  }

  // 2. Sync to Supabase if configured
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
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify([{
          id: submission_id,
          guest_name,
          phone,
          side,
          attending,
          guest_count,
          events_attending,
          arrival_info,
          needs_accommodation: 'No',
          blessing_message,
          created_at: record.created_at
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

  // Cache record locally on server
  saveLocalRsvp(record);

  return res.status(200).json({
    success: true,
    data: record,
    sync: {
      googleSheets: syncedToGoogleSheets,
      supabase: syncedToSupabase,
      hasWebhook: Boolean(webhookUrl)
    }
  });
}

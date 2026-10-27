import { validateRsvp } from './rsvpSubmission';
import { createClient } from '@supabase/supabase-js';

// Environment variables for cloud backend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const googleSheetsWebhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';

// Salted cryptographic hash of PIN for zero-plaintext offline fallback
const PIN_SALT = 'tanishq_shivangee_host_salt_2027';
const EXPECTED_HASH = '3ed29bad168891931fbadb91345eb389a0bd7634bd6f122b194ee2c78224afc9';

// Initialize Supabase client if keys are present
let configurationError = false;
export const supabase = (() => {
  if (!supabaseUrl && !supabaseAnonKey) return null;
  try {
    if (!supabaseUrl || !supabaseAnonKey) throw new Error('Incomplete configuration');
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch {
    configurationError = true;
    return null;
  }
})();

const STORAGE_KEY = 'tanishq_shivangee_wedding_rsvps_v1';

// Initial curated blessings to welcome guests on first load
export const INITIAL_BLESSINGS = [
  {
    id: 'seed-1',
    guest_name: 'Dr. Nidhi & Mr. Manish Baluapuri',
    side: 'Baluapuri Family',
    attending: 'Joyfully Attending',
    guest_count: 2,
    events_attending: [
      'Ganesh Poojan & Mamera (14th Feb, 9 AM)',
      'Rangrez Haldi Carnival (14th Feb, 12 PM)',
      'Sham-e-Sangeet & Ring Ceremony (14th Feb, 6 PM)',
      'Barat, Varmala & Sajan Goth Lunch (15th Feb, 9 AM)'
    ],
    arrival_info: 'Host Family (Local / Residing at Venue)',
    needs_accommodation: 'No',
    blessing_message: 'May Lord Ganesha shower endless happiness, laughter, health and prosperity upon our beloved Tanishq and dearest Shivangee as you begin this sacred journey of togetherness! ❤️',
    created_at: '2026-10-20T10:00:00.000Z'
  },
  {
    id: 'seed-2',
    guest_name: 'Mrs. Shweta & Mr. Tarun Kushwah',
    side: 'Kushwah Family',
    attending: 'Joyfully Attending',
    guest_count: 2,
    events_attending: [
      'Ganesh Poojan & Mamera (14th Feb, 9 AM)',
      'Rangrez Haldi Carnival (14th Feb, 12 PM)',
      'Sham-e-Sangeet & Ring Ceremony (14th Feb, 6 PM)',
      'Barat, Varmala & Sajan Goth Lunch (15th Feb, 9 AM)'
    ],
    arrival_info: 'Arriving 13th Feb evening',
    needs_accommodation: 'No',
    blessing_message: 'Our hearts are filled with boundless pride and joy. May Shivangee & Tanishq be blessed with eternal companionship, mutual respect, and unconditional love.',
    created_at: '2026-10-21T12:30:00.000Z'
  },
  {
    id: 'seed-3',
    guest_name: 'Shikhar Baluapuri',
    side: 'Baluapuri Family',
    attending: 'Joyfully Attending',
    guest_count: 1,
    events_attending: [
      'Ganesh Poojan & Mamera (14th Feb, 9 AM)',
      'Rangrez Haldi Carnival (14th Feb, 12 PM)',
      'Sham-e-Sangeet & Ring Ceremony (14th Feb, 6 PM)',
      'Barat, Varmala & Sajan Goth Lunch (15th Feb, 9 AM)'
    ],
    arrival_info: 'All Days with the Groom',
    needs_accommodation: 'No',
    blessing_message: 'Can’t wait to dance at the Sangeet and celebrate the most royal wedding of the year! Wishing Bhai Tanishq and Bhabhi Shivangee a lifetime of joy and adventures! 🥂✨',
    created_at: '2026-10-22T14:15:00.000Z'
  }
];

// Sanitize inputs to prevent spreadsheet formula injection (=, +, -, @)
function sanitizeForSpreadsheet(val) {
  if (typeof val !== 'string') return val;
  const trimmed = val.trim();
  if (/^[=+\-@]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

/**
 * Verify host dashboard PIN securely
 * Primary: Server-side API endpoint (/api/verify-pin)
 * Fallback: SHA-256 salted hash comparison (PIN is never stored plaintext anywhere)
 */
export async function verifyHostPin(enteredPin) {
  const pin = (enteredPin || '').toString().trim();
  if (!pin) return { success: false, error: 'Please enter your 4-digit PIN.' };

  // 1. Try server-side verification endpoint
  try {
    const res = await fetch('/api/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        sessionStorage.setItem('host_session_token', data.token);
      }
      return { success: true, token: data.token };
    }

    if (res.status === 401) {
      return { success: false, error: 'Incorrect PIN. Please try again.' };
    }
    if (res.status === 429) {
      return { success: false, error: 'Too many failed attempts. Please wait 15 minutes.' };
    }
  } catch (e) {
    // Server endpoint unreachable (e.g. offline preview), proceed to cryptographic fallback
  }

  // 2. Cryptographic Salted SHA-256 hash check fallback
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + PIN_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === EXPECTED_HASH) {
      const fallbackToken = 'local-auth-' + Date.now();
      sessionStorage.setItem('host_session_token', fallbackToken);
      return { success: true, token: fallbackToken };
    }
  } catch (err) {
    console.error('Hash verification failed:', err);
  }

  return { success: false, error: 'Incorrect PIN. Please try again.' };
}

/**
 * Fetch protected host RSVPs with session token
 */
export async function fetchProtectedAdminRsvps() {
  const token = sessionStorage.getItem('host_session_token') || '';

  try {
    const res = await fetch('/api/admin-rsvps', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const result = await res.json();
      return {
        rsvps: result.rsvps || [],
        telemetry: result.telemetry || null,
        status: result.status || null
      };
    }
  } catch (e) {
    console.warn('Server admin endpoint not available, falling back to local store:', e);
  }

  // Fallback to local storage / Supabase
  const localList = await getAllRsvps();
  return {
    rsvps: localList,
    telemetry: null,
    status: {
      googleSheetsConfigured: Boolean(googleSheetsWebhookUrl),
      supabaseConfigured: Boolean(supabase),
      spreadsheetName: 'Tanishq & Shivangee — Wedding RSVP 2027',
      driveFolderName: 'Tanishq & Shivangee — Wedding RSVP'
    }
  };
}

/**
 * Trigger authorized manual retry for Google Sheets sync or WhatsApp notification
 */
export async function retryRsvpSync({ rsvp_id = null, action = 'all', webhookUrl = null } = {}) {
  const token = sessionStorage.getItem('host_session_token') || '';
  const targetWebhook = webhookUrl || (typeof window !== 'undefined' ? localStorage.getItem('wedding_sheets_webhook_url') : '') || googleSheetsWebhookUrl;

  try {
    const res = await fetch('/api/retry-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rsvp_id, action, webhookUrl: targetWebhook })
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: err.message };
  }
}


/**
 * Test live Google Sheets Webhook connection
 */
export async function testGoogleSheetsConnection(customWebhookUrl = null) {
  const targetUrl = customWebhookUrl || googleSheetsWebhookUrl;
  try {
    const res = await fetch('/api/test-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: targetUrl })
    });

    const data = await res.json();
    return data;
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Get all RSVPs from LocalStorage or Supabase
 */
export async function getAllRsvps() {
  let localData = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      localData = JSON.parse(raw);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLESSINGS));
      localData = INITIAL_BLESSINGS;
    }
  } catch (err) {
    console.error('Error reading localStorage RSVPs:', err);
    localData = INITIAL_BLESSINGS;
  }

  // If Supabase is configured, fetch live cloud data
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('wedding_rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const combined = [...data];
        localData.forEach(item => {
          if (!combined.some(c => c.id === item.id || (c.phone && c.phone === item.phone))) {
            combined.push(item);
          }
        });
        return combined;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local data:', e);
    }
  }

  return localData;
}

/**
 * Submit an RSVP
 * 1. Sends to server API /api/rsvp (which forwards to Google Sheets & Supabase with formula sanitization & WhatsApp routing)
 * 2. If client has direct webhook, sends as secondary backup conforming to the 14 columns
 * 3. Persists in localStorage and broadcasts event
 */
export async function submitRsvp(formData) {
  const validated = validateRsvp(formData);
  const timestampIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Generate fallback RSVP ID if needed
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomSuffix = '';
  for (let i = 0; i < 6; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const clientRsvpId = validated.rsvp_id || `RSVP-2027-${randomSuffix}`;

  const newRecord = {
    ...validated,
    id: crypto.randomUUID(),
    submission_id: crypto.randomUUID(),
    rsvp_id: clientRsvpId,
    created_at: new Date().toISOString(),
    submitted_at: timestampIST,
    last_updated: timestampIST,
    guest_name: sanitizeForSpreadsheet(validated.guest_name),
    phone: sanitizeForSpreadsheet(validated.phone),
    side: sanitizeForSpreadsheet(validated.side),
    arrival_date: sanitizeForSpreadsheet(validated.arrival_date),
    arrival_time: sanitizeForSpreadsheet(validated.arrival_time),
    blessing_message: sanitizeForSpreadsheet(validated.blessing_message || ''),
    community_consent: validated.community_consent,
    community_invite_status: validated.attending === 'Regretfully Declining' 
      ? (validated.community_consent ? 'invitation_available' : 'declined')
      : (validated.community_consent ? 'invitation_available' : 'not_consented'),
    sheets_sync_status: 'pending',
    whatsapp_notify_status: 'pending_manual_dispatch',
    webhookUrl: (typeof window !== 'undefined' ? localStorage.getItem('wedding_sheets_webhook_url') : '') || googleSheetsWebhookUrl || undefined
  };

  let serverSynced = false;
  let googleSheetsSynced = false;
  let supabaseSynced = false;
  let whatsappNotificationSent = false;
  let serverRecord = null;

  // 1. Submit through serverless backend API
  try {
    const apiRes = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    });

    if (apiRes.ok) {
      const apiData = await apiRes.json();
      serverSynced = true;
      googleSheetsSynced = Boolean(apiData.sync?.googleSheets);
      supabaseSynced = Boolean(apiData.sync?.supabase);
      whatsappNotificationSent = Boolean(apiData.sync?.whatsappAutomated);
      serverRecord = apiData.data;
    }
  } catch (e) {
    console.warn('Backend /api/rsvp offline or unreachable, using client sync:', e);
  }

  const finalRecord = serverRecord || newRecord;
  if (googleSheetsSynced) finalRecord.sheets_sync_status = 'synced';
  if (whatsappNotificationSent) finalRecord.whatsapp_notify_status = 'sent';

  // 2. Client-side Google Sheets direct webhook fallback if configured and server didn't sync
  const webhookUrl = googleSheetsWebhookUrl || (typeof window !== 'undefined' ? window.__VITE_GOOGLE_SHEETS_WEBHOOK_URL : '');
  if (webhookUrl && !googleSheetsSynced) {
    try {
      const payload = {
        rsvp_id: finalRecord.rsvp_id,
        submitted_at: finalRecord.submitted_at,
        guest_name: finalRecord.guest_name,
        phone: finalRecord.phone.startsWith('+') ? `'${finalRecord.phone}` : `'${finalRecord.phone}`,
        side: finalRecord.side,
        attending: finalRecord.attending,
        guest_count: finalRecord.guest_count,
        events_attending: (finalRecord.events_attending || []).join('; '),
        arrival_date: finalRecord.arrival_date || '14 February 2027',
        arrival_time: finalRecord.arrival_time || '10:30 AM',
        blessing_message: finalRecord.blessing_message || '',
        community_invite_status: finalRecord.community_consent ? 'Invitation Available' : 'Not Opted In',
        whatsapp_notify_status: finalRecord.whatsapp_notify_status,
        last_updated: finalRecord.last_updated
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload)
      });
      googleSheetsSynced = true;
      finalRecord.sheets_sync_status = 'synced';
    } catch (err) {
      console.warn('Client Google Sheets webhook fallback error:', err);
    }
  }

  // 3. Client-side Supabase direct insert fallback
  if (supabase && !supabaseSynced) {
    try {
      await supabase.from('wedding_rsvps').insert([finalRecord]);
      supabaseSynced = true;
    } catch (err) {
      console.warn('Client Supabase fallback error:', err);
    }
  }

  // 4. Save to localStorage with deduplication by phone / rsvp_id
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : INITIAL_BLESSINGS;
    const existing = Array.isArray(parsed) ? parsed : [];
    const cleanPhone = finalRecord.phone.replace(/\D/g, '');
    const filtered = existing.filter(item => 
      item.rsvp_id !== finalRecord.rsvp_id &&
      (item.phone || '').replace(/\D/g, '') !== cleanPhone
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify([finalRecord, ...filtered]));
  } catch (err) {
    console.error('Local storage save error:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wedding_rsvp_added', { detail: finalRecord }));
  }

  return {
    success: true,
    data: finalRecord,
    backend: serverSynced ? 'server' : (supabaseSynced ? 'supabase' : (googleSheetsSynced ? 'googleSheets' : 'local')),
    cloudSync: {
      server: serverSynced,
      googleSheets: googleSheetsSynced,
      supabase: supabaseSynced,
      whatsapp: whatsappNotificationSent
    }
  };
}

/**
 * Subscribe to live updates for the Wall of Blessings & Headcount
 */
export function subscribeToRsvps(onUpdate) {
  const handleLocalUpdate = (e) => {
    onUpdate(e.detail);
  };
  window.addEventListener('wedding_rsvp_added', handleLocalUpdate);

  let subscription = null;
  if (supabase) {
    try {
      subscription = supabase
        .channel('public:wedding_rsvps')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wedding_rsvps' }, payload => {
          onUpdate(payload.new);
        })
        .subscribe();
    } catch (e) {
      console.warn('Could not subscribe to Supabase channel:', e);
    }
  }

  return () => {
    window.removeEventListener('wedding_rsvp_added', handleLocalUpdate);
    if (subscription && supabase) {
      supabase.removeChannel(subscription);
    }
  };
}

/**
 * Calculate metrics for family admin dashboard
 */
export function calculateHeadcountMetrics(rsvps = []) {
  const totalRsvps = rsvps.length;
  
  const attendingRsvps = rsvps.filter(r => r.attending === 'Joyfully Attending');
  const declinedCount = rsvps.filter(r => r.attending === 'Regretfully Declining').length;
  
  const totalHeadcount = attendingRsvps.reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);
  const roomsNeededCount = attendingRsvps.filter(r => r.needs_accommodation === 'Yes').length;
  
  // Event breakdowns
  const ganeshPoojanCount = attendingRsvps.filter(r => 
    r.events_attending?.some(e => e.toLowerCase().includes('ganesh'))
  ).reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);

  const haldiCount = attendingRsvps.filter(r => 
    r.events_attending?.some(e => e.toLowerCase().includes('haldi'))
  ).reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);

  const sangeetCount = attendingRsvps.filter(r => 
    r.events_attending?.some(e => e.toLowerCase().includes('sangeet'))
  ).reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);

  const weddingCount = attendingRsvps.filter(r => 
    r.events_attending?.some(e => 
      e.toLowerCase().includes('barat') || 
      e.toLowerCase().includes('varmala') || 
      e.toLowerCase().includes('wedding')
    )
  ).reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);

  // Side breakdowns
  const baluapuriCount = attendingRsvps.filter(r => r.side === 'Baluapuri Family')
    .reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);
  const kushwahCount = attendingRsvps.filter(r => r.side === 'Kushwah Family' || r.side === 'Verma / Kushwah Family')
    .reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);
  const friendsCount = attendingRsvps.filter(r => r.side === 'Friends & Colleagues')
    .reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);

  return {
    totalRsvps,
    attendingCount: attendingRsvps.length,
    declinedCount,
    totalHeadcount,
    roomsNeededCount,
    events: {
      ganeshPoojan: ganeshPoojanCount,
      haldi: haldiCount,
      sangeet: sangeetCount,
      wedding: weddingCount
    },
    sides: {
      baluapuri: baluapuriCount,
      kushwah: kushwahCount,
      verma: kushwahCount,
      friends: friendsCount
    }
  };
}

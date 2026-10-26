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
      if (result.rsvps && result.rsvps.length > 0) {
        return {
          rsvps: result.rsvps,
          status: result.status
        };
      }
    }
  } catch (e) {
    console.warn('Server admin endpoint not available, falling back to local store:', e);
  }

  // Fallback to local storage / Supabase
  const localList = await getAllRsvps();
  return {
    rsvps: localList,
    status: {
      googleSheetsConfigured: Boolean(googleSheetsWebhookUrl),
      supabaseConfigured: Boolean(supabase)
    }
  };
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
 * 1. Sends to server API /api/rsvp (which forwards to Google Sheets & Supabase with formula sanitization)
 * 2. If client has direct webhook, sends as secondary backup
 * 3. Persists in localStorage and broadcasts event
 */
export async function submitRsvp(formData) {
  const validated = validateRsvp(formData);
  const timestampIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const newRecord = {
    ...validated,
    id: crypto.randomUUID(),
    submission_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    submitted_at: timestampIST,
    guest_name: sanitizeForSpreadsheet(validated.guest_name),
    phone: sanitizeForSpreadsheet(validated.phone),
    side: sanitizeForSpreadsheet(validated.side),
    blessing_message: sanitizeForSpreadsheet(validated.blessing_message || '')
  };

  let serverSynced = false;
  let googleSheetsSynced = false;
  let supabaseSynced = false;

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
    }
  } catch (e) {
    console.warn('Backend /api/rsvp offline or unreachable, using client sync:', e);
  }

  // 2. Client-side Google Sheets direct webhook fallback if configured and server didn't sync
  const webhookUrl = googleSheetsWebhookUrl || (typeof window !== 'undefined' ? window.__VITE_GOOGLE_SHEETS_WEBHOOK_URL : '');
  if (webhookUrl && !googleSheetsSynced) {
    try {
      const hasEvent = pattern => (newRecord.events_attending || []).some(ev => pattern.test(ev));
      const payload = {
        submission_id: newRecord.submission_id || newRecord.id,
        timestamp: timestampIST,
        guest_name: newRecord.guest_name,
        phone: newRecord.phone.startsWith('+') ? `'${newRecord.phone}` : `'${newRecord.phone}`,
        side: newRecord.side,
        attending: newRecord.attending,
        guest_count: newRecord.guest_count,
        arrival_date: newRecord.arrival_date || '14 February 2027',
        arrival_time: newRecord.arrival_time || '10:30 AM',
        blessing_message: newRecord.blessing_message || '',
        ganesh_poojan: hasEvent(/Ganesh/i) ? 'YES' : 'NO',
        haldi_carnival: hasEvent(/Haldi/i) ? 'YES' : 'NO',
        sangeet: hasEvent(/Sangeet/i) ? 'YES' : 'NO',
        wedding: hasEvent(/Varmala|Barat|Wedding/i) ? 'YES' : 'NO',
        arrival_info: newRecord.arrival_info,
        needs_accommodation: 'No'
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload)
      });
      googleSheetsSynced = true;
    } catch (err) {
      console.warn('Client Google Sheets webhook fallback error:', err);
    }
  }

  // 3. Client-side Supabase direct insert fallback
  if (supabase && !supabaseSynced) {
    try {
      await supabase.from('wedding_rsvps').insert([newRecord]);
      supabaseSynced = true;
    } catch (err) {
      console.warn('Client Supabase fallback error:', err);
    }
  }

  // 4. Save to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : INITIAL_BLESSINGS;
    const existing = Array.isArray(parsed) ? parsed : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newRecord, ...existing.filter(item => item.phone !== newRecord.phone)]));
  } catch (err) {
    console.error('Local storage save error:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wedding_rsvp_added', { detail: newRecord }));
  }

  return {
    success: true,
    data: newRecord,
    backend: serverSynced ? 'server' : (supabaseSynced ? 'supabase' : (googleSheetsSynced ? 'googleSheets' : 'local')),
    cloudSync: {
      server: serverSynced,
      googleSheets: googleSheetsSynced,
      supabase: supabaseSynced
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

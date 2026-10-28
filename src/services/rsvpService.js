import { sendRsvp } from './rsvpClient.js';
import { validateRsvp } from './rsvpSubmission';
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

export async function verifyHostPin(enteredPin) {
  const pin = (enteredPin || '').toString().trim();
  if (!pin) return { success: false, error: 'Please enter your host passphrase.' };

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
    // Fail closed when server authentication is unavailable.
  }

  return { success: false, error: 'Host authentication is unavailable. Please retry.' };
}

/**
 * Fetch protected host RSVPs with session token
 */
export async function fetchProtectedAdminRsvps() {
  const response = await fetch('/api/admin-rsvps', { headers: { Authorization: `Bearer ${sessionStorage.getItem('host_session_token') || ''}` } });
  const result = await response.json();
  if (!response.ok || result.success !== true) throw new Error(result.error || 'Unable to load confirmed RSVPs.');
  return result;
}

/**
 * Trigger authorized manual retry for Google Sheets sync or WhatsApp notification
 */
export async function retryRsvpSync({ rsvp_id = null, action = 'sheets' } = {}) {
  const token = sessionStorage.getItem('host_session_token') || '';

  try {
    const res = await fetch('/api/retry-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rsvp_id, action })
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
export async function testGoogleSheetsConnection() {
  try {
    const response = await fetch('/api/test-sheets', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('host_session_token') || ''}` }, body: '{}'
    });
    return await response.json();
  } catch { return { success: false, error: 'Connection check failed.' }; }
}

/**
 * Get all RSVPs from LocalStorage or Supabase
 */
export async function getAllRsvps() {
  // The public wall contains curated messages; private RSVP data is host-only.
  return INITIAL_BLESSINGS.map(item => ({ ...item }));
}

/** Only the server can confirm durable acceptance. */
export async function submitRsvp(formData) {
  const result = await sendRsvp(validateRsvp(formData));
  window.dispatchEvent(new CustomEvent('wedding_rsvp_added', { detail: result.data }));
  return result;
}

/**
 * Subscribe to live updates for the Wall of Blessings & Headcount
 */
export function subscribeToRsvps(onUpdate) {
  const handleLocalUpdate = (e) => {
    onUpdate(e.detail);
  };
  window.addEventListener('wedding_rsvp_added', handleLocalUpdate);

  return () => window.removeEventListener('wedding_rsvp_added', handleLocalUpdate);
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

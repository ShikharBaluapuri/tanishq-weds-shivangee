import { validateRsvp } from './rsvpSubmission';
import { createClient } from '@supabase/supabase-js';

// Environment variables for cloud backend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const googleSheetsWebhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';

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
    side: 'Verma / Kushwah Family',
    attending: 'Joyfully Attending',
    guest_count: 2,
    events_attending: [
      'Ganesh Poojan & Mamera (14th Feb, 9 AM)',
      'Rangrez Haldi Carnival (14th Feb, 12 PM)',
      'Sham-e-Sangeet & Ring Ceremony (14th Feb, 6 PM)',
      'Barat, Varmala & Sajan Goth Lunch (15th Feb, 9 AM)'
    ],
    arrival_info: 'Arriving 13th Feb evening',
    needs_accommodation: 'Yes',
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
  },
  {
    id: 'seed-4',
    guest_name: 'Mrs. Rajshree & Mr. Shailesh Baluapuri',
    side: 'Baluapuri Family',
    attending: 'Joyfully Attending',
    guest_count: 2,
    events_attending: [
      'Ganesh Poojan & Mamera (14th Feb, 9 AM)',
      'Rangrez Haldi Carnival (14th Feb, 12 PM)',
      'Sham-e-Sangeet & Ring Ceremony (14th Feb, 6 PM)',
      'Barat, Varmala & Sajan Goth Lunch (15th Feb, 9 AM)'
    ],
    arrival_info: '14th Feb 8:00 AM',
    needs_accommodation: 'Yes',
    blessing_message: 'शुभविवाह की अनन्त शुभकामनाएं! ईश्वर दोनों को दीर्घायु, सुख, और अपार प्रेम प्रदान करे।',
    created_at: '2026-10-23T09:00:00.000Z'
  },
  {
    id: 'seed-5',
    guest_name: 'Tanvi, Chetna & Tanay',
    side: 'Friends & Colleagues',
    attending: 'Joyfully Attending',
    guest_count: 3,
    events_attending: [
      'Rangrez Haldi Carnival (14th Feb, 12 PM)',
      'Sham-e-Sangeet & Ring Ceremony (14th Feb, 6 PM)',
      'Barat, Varmala & Sajan Goth Lunch (15th Feb, 9 AM)'
    ],
    arrival_info: 'Train to Chhindwara on 14th morning',
    needs_accommodation: 'Yes',
    blessing_message: 'Counting down the days to the Haldi pool party and Sangeet madness! Best wishes to our dearest couple! 🎉🕺💃',
    created_at: '2026-10-24T18:20:00.000Z'
  }
];

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
        // Merge Supabase data with local data to avoid duplicates
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

export async function submitRsvp(formData) {
  const newRecord = { ...validateRsvp(formData), id: crypto.randomUUID(), created_at: new Date().toISOString() };
  const webhookUrl = googleSheetsWebhookUrl || (typeof window !== 'undefined' ? window.__VITE_GOOGLE_SHEETS_WEBHOOK_URL : '');
  const backend = supabaseUrl || supabaseAnonKey ? 'supabase' : webhookUrl ? 'googleSheets' : 'local';
  if (configurationError) throw new Error('RSVP storage is not configured correctly. Please contact the hosts.');

  if (backend !== 'local') {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      if (backend === 'supabase') {
        const { error } = await supabase.from('wedding_rsvps').insert([newRecord]);
        if (error) throw error;
      } else {
        const url = new URL(webhookUrl);
        if (url.protocol !== 'https:') throw new Error('Invalid webhook URL');
        const hasEvent = pattern => newRecord.events_attending.some(e => pattern.test(e));
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          signal: controller.signal,
          body: JSON.stringify({ ...newRecord, timestamp: newRecord.created_at,
            ganesh_poojan: hasEvent(/Ganesh/i) ? 'YES' : 'NO',
            haldi_carnival: hasEvent(/Haldi/i) ? 'YES' : 'NO',
            sangeet: hasEvent(/Sangeet/i) ? 'YES' : 'NO',
            wedding: hasEvent(/Varmala|Barat|Wedding/i) ? 'YES' : 'NO',
          }),
        });
        if (!response.ok || (await response.json()).status !== 'success') throw new Error('Unconfirmed save');
      }
    } catch {
      throw new Error('We could not confirm your RSVP was saved. Please contact the hosts or try again.');
    } finally {
      clearTimeout(timeout);
    }
  }

  let localSaved = false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : INITIAL_BLESSINGS;
    const existing = Array.isArray(parsed) ? parsed : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newRecord, ...existing.filter(item => item.phone !== newRecord.phone)]));
    localSaved = true;
  } catch {
    if (backend === 'local') throw new Error('Unable to save your RSVP on this device. Please contact the hosts.');
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('wedding_rsvp_added', { detail: newRecord }));
  return { success: true, data: newRecord, backend, localSaved, cloudSync: { supabase: backend === 'supabase', googleSheets: backend === 'googleSheets' } };
}

/**
 * Subscribe to live updates for the Wall of Blessings & Headcount
 */
export function subscribeToRsvps(onUpdate) {
  // Listen to local events
  const handleLocalUpdate = (e) => {
    onUpdate(e.detail);
  };
  window.addEventListener('wedding_rsvp_added', handleLocalUpdate);

  // If Supabase is active, listen to real-time changes
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
  const vermaCount = attendingRsvps.filter(r => r.side === 'Verma / Kushwah Family')
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
      verma: vermaCount,
      friends: friendsCount
    }
  };
}

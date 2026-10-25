import { createClient } from '@supabase/supabase-js';

// Environment variables for cloud backend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const googleSheetsWebhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';

// Initialize Supabase client if keys are present
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

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

/**
 * Save new RSVP:
 * 1. Store in LocalStorage (synchronously guaranteeing offline demo functionality)
 * 2. Send to Google Sheets Webhook via fetch POST
 * 3. Send to Supabase if configured
 */
export async function submitRsvp(formData) {
  const newRecord = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    guest_name: formData.guest_name.trim(),
    phone: formData.phone.trim(),
    side: formData.side || 'Friends & Colleagues',
    attending: formData.attending,
    guest_count: formData.attending === 'Regretfully Declining' ? 0 : Number(formData.guest_count || 1),
    events_attending: formData.attending === 'Regretfully Declining' ? [] : (formData.events_attending || []),
    arrival_info: formData.arrival_info?.trim() || 'Not specified',
    needs_accommodation: formData.needs_accommodation || 'No',
    blessing_message: formData.blessing_message?.trim() || '',
    created_at: new Date().toISOString()
  };

  // 1. Save to LocalStorage
  try {
    const existing = await getAllRsvps();
    const updated = [newRecord, ...existing.filter(item => item.phone !== newRecord.phone)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wedding_rsvp_added', { detail: newRecord }));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }

  // 2. Submit to Google Sheets Webhook
  let googleSheetSuccess = false;
  const webhookUrl = googleSheetsWebhookUrl || (typeof window !== 'undefined' ? window.__VITE_GOOGLE_SHEETS_WEBHOOK_URL : '');
  
  if (webhookUrl) {
    try {
      const payload = {
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        guest_name: newRecord.guest_name,
        phone: newRecord.phone,
        side: newRecord.side,
        attending: newRecord.attending,
        guest_count: newRecord.guest_count,
        ganesh_poojan: newRecord.events_attending.some(e => e.includes('Ganesh')) ? 'YES' : 'NO',
        haldi_carnival: newRecord.events_attending.some(e => e.includes('Haldi')) ? 'YES' : 'NO',
        sangeet: newRecord.events_attending.some(e => e.includes('Sangeet')) ? 'YES' : 'NO',
        wedding: newRecord.events_attending.some(e => e.includes('Varmala') || e.includes('Barat') || e.includes('Wedding')) ? 'YES' : 'NO',
        arrival_info: newRecord.arrival_info,
        needs_accommodation: newRecord.needs_accommodation,
        blessing_message: newRecord.blessing_message
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', // Allows sending cross-origin requests to Google Apps Script web apps
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      googleSheetSuccess = true;
    } catch (sheetErr) {
      console.warn('Google Sheets Webhook submission error:', sheetErr);
    }
  }

  // 3. Submit to Supabase
  let supabaseSuccess = false;
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('wedding_rsvps')
        .insert([{
          guest_name: newRecord.guest_name,
          phone: newRecord.phone,
          side: newRecord.side,
          attending: newRecord.attending,
          guest_count: newRecord.guest_count,
          events_attending: newRecord.events_attending,
          arrival_info: newRecord.arrival_info,
          needs_accommodation: newRecord.needs_accommodation,
          blessing_message: newRecord.blessing_message,
          created_at: newRecord.created_at
        }]);

      if (!error) {
        supabaseSuccess = true;
      } else {
        console.warn('Supabase insert warning:', error);
      }
    } catch (supaErr) {
      console.warn('Supabase insert failed:', supaErr);
    }
  }

  return {
    success: true,
    data: newRecord,
    cloudSync: {
      supabase: supabaseSuccess,
      googleSheets: googleSheetSuccess
    }
  };
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

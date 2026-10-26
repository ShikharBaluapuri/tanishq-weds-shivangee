export interface RsvpConfirmation {
  guest_name: string;
  attending: 'Joyfully Attending' | 'Regretfully Declining';
  guest_count: number;
  events_attending?: string[];
  dietary_notes?: string;
  event_notes?: string;
  rsvp_id?: string;
  side?: string;
  arrival_date?: string;
  arrival_time?: string;
  blessing_message?: string;
}

// Canonical Family Routing Numbers
export const FAMILY_RECIPIENTS = {
  BALUAPURI: '919425006278', // Dr. Nidhi & Mr. Manish Baluapuri
  KUSHWAH: '918319433078',   // Kushwah Family
  DEFAULT_FRIENDS: '919425006278' // Configurable in host dashboard
} as const;

export function normalizePhone(phone: string): string {
  if (typeof phone !== 'string' || !/^\+?[\d\s().-]+$/.test(phone.trim())) {
    throw new Error('Enter a valid phone number with country code.');
  }
  const digits = phone.replace(/\D/g, '');
  const normalized = !phone.trim().startsWith('+') && digits.length === 10 ? `91${digits}` : digits;
  if (!/^[1-9]\d{9,14}$/.test(normalized)) throw new Error('Enter a valid phone number with country code.');
  return normalized;
}

/**
 * Determine exact recipient phone based on selected family affiliation
 * - Baluapuri Family -> +91 9425006278
 * - Kushwah Family -> +91 8319433078
 * - Friends & Colleagues -> Configurable (default +91 9425006278)
 */
export function getFamilyRecipient(side?: string, customFriendsRecipient?: string): string {
  const normalizedSide = (side || '').toLowerCase();
  if (normalizedSide.includes('baluapuri')) {
    return FAMILY_RECIPIENTS.BALUAPURI;
  }
  if (normalizedSide.includes('kushwah') || normalizedSide.includes('verma')) {
    return FAMILY_RECIPIENTS.KUSHWAH;
  }
  if (customFriendsRecipient) {
    try {
      return normalizePhone(customFriendsRecipient);
    } catch {
      // fallback to default
    }
  }
  return FAMILY_RECIPIENTS.DEFAULT_FRIENDS;
}

/**
 * Formats the official WhatsApp notification for family hosts
 * Exactly matches the required luxury format from the Master Prompt
 */
export function formatFamilyNotificationMessage(rsvp: {
  guest_name: string;
  side?: string;
  attending: string;
  guest_count: number;
  events_attending?: string[];
  arrival_date?: string;
  arrival_time?: string;
  blessing_message?: string;
  rsvp_id?: string;
}): string {
  const isAttending = rsvp.attending === 'Joyfully Attending';
  const attendanceText = isAttending ? 'Attending' : 'Declining';
  const events = isAttending && rsvp.events_attending && rsvp.events_attending.length > 0
    ? rsvp.events_attending.join(', ')
    : (isAttending ? 'All Wedding Functions' : 'None');
  
  const arrival = isAttending && rsvp.arrival_date
    ? `${rsvp.arrival_date}${rsvp.arrival_time ? ' at ' + rsvp.arrival_time : ''}`
    : (isAttending ? '14–15 February 2027 (The Waterstone Resort)' : 'Not Attending');
    
  const blessing = rsvp.blessing_message && rsvp.blessing_message.trim()
    ? `"${rsvp.blessing_message.trim()}"`
    : 'None provided';

  return [
    '🌸 *Tanishq & Shivangee — Wedding RSVP*',
    '',
    'A new wedding response has been received!',
    '',
    `*Guest:* ${rsvp.guest_name.trim()}`,
    `*Family:* ${rsvp.side || 'Friends & Colleagues'}`,
    `*Attendance:* ${attendanceText}`,
    `*Number of Guests:* ${rsvp.guest_count}`,
    `*Functions:* ${events}`,
    `*Arrival:* ${arrival}`,
    `*Blessing:* ${blessing}`,
    `*RSVP ID:* ${rsvp.rsvp_id || 'Pending'}`,
    '',
    'Please check the host dashboard for complete details.'
  ].join('\n');
}

/**
 * Guest confirmation message for sharing with hosts
 */
export function formatRsvpConfirmation(data: RsvpConfirmation): string {
  const attending = data.attending === 'Joyfully Attending';
  return [
    `Hello! Confirming RSVP for Tanishq & Shivangee's Wedding.`,
    `*Guest:* ${data.guest_name.trim()}`,
    `*Status:* ${attending ? `Joyfully Attending (${data.guest_count} guests)` : 'Regretfully Declining'}`,
    attending && data.events_attending?.length ? `*Events:* ${data.events_attending.join('; ')}` : '',
    attending && data.arrival_date ? `*Arrival:* ${data.arrival_date} ${data.arrival_time || ''}`.trim() : '',
    data.blessing_message ? `*Blessing:* "${data.blessing_message.trim()}"` : '',
    data.rsvp_id ? `*RSVP ID:* ${data.rsvp_id}` : '',
    '',
    'Looking forward to celebrating with the Baluapuri & Kushwah families! ✨'
  ].filter(Boolean).join('\n');
}

export function createWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function createWhatsAppWebhookLink(endpoint: string, phone: string, message: string): string {
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Webhook must use HTTPS without embedded credentials.');
  url.searchParams.set('phone', normalizePhone(phone));
  url.searchParams.set('text', message);
  return url.toString();
}

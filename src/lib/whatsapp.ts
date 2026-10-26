export interface RsvpConfirmation {
  guest_name: string;
  attending: 'Joyfully Attending' | 'Regretfully Declining';
  guest_count: number;
  events_attending?: string[];
  dietary_notes?: string;
  event_notes?: string;
}

export function normalizePhone(phone: string): string {
  if (typeof phone !== 'string' || !/^\+?[\d\s().-]+$/.test(phone.trim())) {
    throw new Error('Enter a valid phone number with country code.');
  }
  const digits = phone.replace(/\D/g, '');
  const normalized = !phone.trim().startsWith('+') && digits.length === 10 ? `91${digits}` : digits;
  if (!/^[1-9]\d{9,14}$/.test(normalized)) throw new Error('Enter a valid phone number with country code.');
  return normalized;
}

export function formatRsvpConfirmation(data: RsvpConfirmation): string {
  const attending = data.attending === 'Joyfully Attending';
  return [
    `Hello ${data.guest_name.trim()}!`,
    `Thank you for your RSVP to Tanishq & Shivangee's wedding.`,
    attending ? `We look forward to welcoming you and your party of ${data.guest_count} on 14–15 February 2027!` : `We'll miss you and appreciate you letting us know.`,
    attending && data.events_attending?.length ? `Events: ${data.events_attending.join('; ')}` : '',
    data.dietary_notes ? `Dietary notes: ${data.dietary_notes}` : '',
    data.event_notes ? `Event notes: ${data.event_notes}` : '',
  ].filter(Boolean).join('\n\n');
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

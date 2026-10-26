import { normalizePhone, type RsvpConfirmation } from '../lib/whatsapp';

export class RsvpValidationError extends Error {
  fields: Record<string, string>;

  constructor(fields: Record<string, string>) {
    super(Object.values(fields).join(' '));
    this.name = 'RsvpValidationError';
    this.fields = fields;
  }
}

export function validateRsvp(input: Record<string, unknown>): RsvpConfirmation & {
  phone: string; side: string; arrival_info: string; needs_accommodation: string; blessing_message: string;
  dietary_notes: string; event_notes: string;
} {
  const errors: Record<string, string> = {};
  const text = (key: string, max: number, required = false) => {
    const value = input?.[key];
    if (value != null && typeof value !== 'string') errors[key] = `${key} must be text.`;
    const result = typeof value === 'string' ? value.trim() : '';
    if ((required && !result) || result.length > max) errors[key] = `${key} must ${required ? 'contain 1' : 'contain 0'}–${max} characters.`;
    return result;
  };

  const guest_name = text('guest_name', 120, true);
  let phone = '';
  try { phone = normalizePhone(text('phone', 40, true)); } catch { errors.phone = 'Enter a valid phone number with country code.'; }
  const attending = input?.attending;
  if (attending !== 'Joyfully Attending' && attending !== 'Regretfully Declining') errors.attending = 'Choose an attendance status.';
  const rawCount = input?.guest_count;
  const count = typeof rawCount === 'number' || (typeof rawCount === 'string' && /^\d+$/.test(rawCount)) ? Number(rawCount) : NaN;
  if (!Number.isInteger(count) || count < (attending === 'Regretfully Declining' ? 0 : 1) || count > 10) errors.guest_count = 'Guest count must be a whole number from 1 to 10 (0 when declining).';
  const events = input?.events_attending ?? [];
  if (!Array.isArray(events) || events.length > 4 || events.some(e => typeof e !== 'string' || !e.trim() || e.length > 200)) errors.events_attending = 'Select valid celebration events.';
  if (attending === 'Joyfully Attending' && Array.isArray(events) && !events.length) errors.events_attending = 'Select at least one event.';

  const result = {
    guest_name,
    phone,
    attending: attending as RsvpConfirmation['attending'],
    guest_count: attending === 'Regretfully Declining' ? 0 : count,
    events_attending: attending === 'Regretfully Declining' ? [] : Array.isArray(events) ? [...new Set(events.map(e => typeof e === 'string' ? e.trim() : ''))] : [],
    side: text('side', 100) || 'Friends & Colleagues',
    arrival_info: text('arrival_info', 500),
    needs_accommodation: text('needs_accommodation', 3) || 'No',
    blessing_message: text('blessing_message', 2000),
    dietary_notes: text('dietary_notes', 1000),
    event_notes: text('event_notes', 1000),
  };
  if (!['Yes', 'No'].includes(result.needs_accommodation)) errors.needs_accommodation = 'Choose Yes or No for accommodation.';
  if (Object.keys(errors).length) throw new RsvpValidationError(errors);
  return result;
}

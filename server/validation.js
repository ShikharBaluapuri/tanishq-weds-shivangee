export function validateSubmission(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid RSVP.');
  const text = (key, max, required = false) => {
    const value = body[key] ?? '';
    if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error(`Invalid ${key}.`);
    return value.trim();
  };
  const rsvp_id = text('rsvp_id', 50, true);
  if (!/^RSVP-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(rsvp_id)) throw new Error('Invalid RSVP ID.');
  const guest_name = text('guest_name', 120, true);
  let phone = text('phone', 40, true).replace(/[\s().+-]/g, '');
  if (phone.length === 10) phone = `91${phone}`;
  if (!/^[1-9]\d{9,14}$/.test(phone)) throw new Error('Enter a valid WhatsApp number.');
  const attending = body.attending;
  if (!['Joyfully Attending', 'Regretfully Declining'].includes(attending)) throw new Error('Choose an attendance response.');
  const declined = attending === 'Regretfully Declining';
  const count = body.guest_count;
  if (!Number.isInteger(count) || count < 0 || count > 10 || (!declined && count < 1)) throw new Error('Invalid guest count.');
  const events = body.events_attending;
  if (!Array.isArray(events) || events.length > 4 || events.some(e => typeof e !== 'string' || !e.trim() || e.length > 200) || (!declined && !events.length)) throw new Error('Select valid wedding functions.');
  if (body.community_consent != null && typeof body.community_consent !== 'boolean') throw new Error('Invalid consent.');
  const arrival_date = declined ? 'Not Attending' : text('arrival_date', 100, true);
  const arrival_time = declined ? '' : text('arrival_time', 50, true);
  if (!declined) {
    const months = 'January February March April May June July August September October November December'.split(' ');
    const match = /^(\d{1,2}) ([A-Za-z]+) (\d{4})$/.exec(arrival_date);
    const month = match ? months.indexOf(match[2]) : -1;
    const date = match ? new Date(Date.UTC(Number(match[3]), month, Number(match[1]))) : null;
    if (!match || month < 0 || date.getUTCMonth() !== month || date.getUTCFullYear() !== Number(match[3])) throw new Error('Choose a valid arrival date.');
    if (!/^(0?[1-9]|1[0-2]):[0-5]\d (AM|PM)$/.test(arrival_time)) throw new Error('Choose a valid arrival time.');
  }
  return { rsvp_id, guest_name, phone, side: text('side', 100, true), attending,
    guest_count: declined ? 0 : count, events_attending: declined ? [] : [...new Set(events.map(e => e.trim()))],
    arrival_date, arrival_time, arrival_mode: declined ? '' : text('arrival_mode', 100),
    blessing_message: text('blessing_message', 2000), community_consent: body.community_consent === true };
}

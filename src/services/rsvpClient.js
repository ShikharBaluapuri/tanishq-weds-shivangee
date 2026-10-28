const memoryIds = new Map();
const inFlight = new Map();

export async function sendRsvp(validated, options = {}) {
  const fetcher = options.fetcher || fetch;
  let storage;
  try { storage = options.storage || globalThis.localStorage; } catch { /* memory fallback */ }
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(validated.phone));
  const key = 'wedding_rsvp_id_' + Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
  let id = memoryIds.get(key);
  try { id ||= storage?.getItem(key); } catch { /* storage may be disabled */ }
  if (!/^RSVP-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id || '')) id = `RSVP-${crypto.randomUUID()}`;
  memoryIds.set(key, id);
  try { storage?.setItem(key, id); } catch { /* keep ID across retries in this page */ }
  const body = JSON.stringify({ ...validated, rsvp_id: id });
  const running = inFlight.get(key);
  if (running) {
    if (running.body !== body) throw new Error('Your previous submission is still saving. Please wait.');
    return running.promise;
  }
  const promise = (async () => {
    let response;
    try {
      response = await fetcher('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: AbortSignal.timeout(110000) });
    } catch { throw new Error('Unable to confirm your RSVP. Please retry with the same details.'); }
    let result;
    try { result = await response.json(); } catch { throw new Error('Unable to confirm your RSVP. Please retry.'); }
    const saved = result?.status === 'saved' && result?.sync?.googleSheets === true;
    const pending = result?.status === 'pending' && result?.sync?.supabase === true;
    if (!response.ok || result?.success !== true || result?.data?.rsvp_id !== id || (!saved && !pending)) {
      throw new Error(result?.error || 'Unable to confirm your RSVP. Please retry.');
    }
    return { ...result, backend: pending ? 'supabase' : 'googleSheets', cloudSync: result.sync };
  })();
  inFlight.set(key, { body, promise });
  try { return await promise; } finally { inFlight.delete(key); }
}

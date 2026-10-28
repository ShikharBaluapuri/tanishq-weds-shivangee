import { createClient } from '@supabase/supabase-js';
import { IntegrationError } from './sheets.js';

export function databaseConfigured() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url && !key) return false;
  if (!url || !key) throw new IntegrationError('Database Configuration Missing');
  return true;
}

function database() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!databaseConfigured()) throw new IntegrationError('Database Configuration Missing');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, options) => fetch(input, { ...options, signal: AbortSignal.timeout(10000) }) }
  });
}

function checked({ data, error, status }) {
  if (error) throw new IntegrationError(status === 409 || error.code === '23505' ? 'RSVP Conflict' : 'Database Unavailable');
  return data;
}

export async function acceptRecord(record) {
  const result = checked(await database().rpc('accept_wedding_rsvp', { incoming: record }));
  if (!result?.record?.rsvp_id) throw new IntegrationError('Database Unavailable');
  return result.record;
}

export async function markSynced(id, updated) {
  if (!checked(await database().rpc('ack_wedding_sync', {job_id:id,record_updated:updated}))) throw new IntegrationError('Synchronization Pending');
}

export async function takeRequest(bucket,maxHits,windowSeconds) {
  return checked(await database().rpc('take_wedding_request',{bucket,max_hits:maxHits,window_seconds:windowSeconds}));
}

export async function updateRecord(record,revision) {
  return checked(await database().rpc('host_update_wedding_rsvp',{incoming:record,expected_revision:revision}));
}

export async function claimSync() {
  return checked(await database().rpc('claim_wedding_sync'));
}

export async function finishSync(job, succeeded, errorCode = null) {
  return checked(await database().rpc('finish_wedding_sync', {
    job_id: job.record.rsvp_id, token: job.lease_token, job_revision: job.revision,
    succeeded, error_code: errorCode
  }));
}

export async function listPrimaryRecords() {
  const records = [];
  for (let start = 0; ; start += 500) {
    const rows = checked(await database().from('wedding_rsvps').select('payload,sheets_sync_status,revision').order('created_at', { ascending: false }).order('id').range(start,start+499));
    records.push(...rows.map(row => ({ ...row.payload, revision:row.revision, sheets_sync_status: row.sheets_sync_status })));
    if (rows.length < 500) return records;
  }
}

export async function listRecords({ pending = false, id = null } = {}) {
  let query = database().from('wedding_rsvp_outbox').select('payload,sheets_sync_status').order('created_at', { ascending: false }).limit(1000);
  if (id) query = query.eq('rsvp_id', id);
  if (pending) query = query.eq('sheets_sync_status', 'pending');
  const rows = checked(await query);
  return rows.map(row => ({ ...row.payload, sheets_sync_status: row.sheets_sync_status }));
}

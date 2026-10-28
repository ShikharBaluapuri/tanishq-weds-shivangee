import { timingSafeEqual } from 'node:crypto';
import { processSyncJob } from '../server/sync-worker.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') return res.status(405).json({ success: false });
  const secret = process.env.SYNC_WORKER_SECRET || '';
  if (secret.length < 32) return res.status(503).json({ success: false });
  const actual = Buffer.from(req.headers?.authorization || '');
  const expected = Buffer.from(`Bearer ${secret}`);
  if (actual.length !== expected.length || !timingSafeEqual(actual,expected)) return res.status(401).json({ success: false });
  try {
    const result = await processSyncJob();
    return res.status(200).json({ success: true, ...result });
  } catch {
    console.error(JSON.stringify({ event:'sync_worker_unavailable' }));
    return res.status(503).json({ success:false });
  }
}

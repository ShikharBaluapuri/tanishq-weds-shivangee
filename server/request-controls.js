import { createHmac } from 'node:crypto';
import { takeRequest } from './store.js';

export async function rateLimit(req,scope,value,maxHits=30,seconds=3600) {
  const secret=process.env.RATE_LIMIT_SECRET;
  if (!secret || secret.length<32) throw Object.assign(new Error('Rate Limit Configuration Missing'),{code:'Configuration Missing'});
  const ip=String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const key=scope+':'+createHmac('sha256',secret).update(value || ip).digest('hex');
  return takeRequest(key,maxHits,seconds);
}

export function sameOrigin(req) {
  const origin=req.headers?.origin;
  if (!origin) return true;
  try { return new URL(origin).host===req.headers.host; } catch { return false; }
}

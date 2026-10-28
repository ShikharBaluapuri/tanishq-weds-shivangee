import crypto from 'node:crypto';
export function verifySession(req) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  const token = req.headers.authorization?.replace(/^Bearer /, '') || req.headers.cookie?.match(/(?:^|;\s*)host_session=([^;]+)/)?.[1] || '';
  const match = /^(\d{13})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return false;
  const age = Date.now() - Number(match[1]);
  if (age < 0 || age > 86400000) return false;
  const expected = crypto.createHmac('sha256', secret).update(match[1]).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(match[2]), Buffer.from(expected));
}

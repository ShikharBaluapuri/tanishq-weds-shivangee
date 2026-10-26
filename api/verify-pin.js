// Vercel Serverless Function: Secure Host PIN Verification
import crypto from 'crypto';

// Rate limiting in-memory store (per IP)
const attempts = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record) return false;

  // Clear if older than 15 minutes
  if (now - record.firstAttempt > 15 * 60 * 1000) {
    attempts.delete(ip);
    return false;
  }

  return record.count >= 6;
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = attempts.get(ip) || { count: 0, firstAttempt: now };
  record.count += 1;
  attempts.set(ip, record);
}

function clearAttempts(ip) {
  attempts.delete(ip);
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too many failed verification attempts. Please wait 15 minutes before trying again.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid request body' });
    }
  }

  const submittedPin = (body?.pin || '').toString().trim();
  const expectedPin = (process.env.HOST_DASHBOARD_PIN || process.env.ADMIN_PIN || '7899').toString().trim();

  // Timing safe comparison using SHA-256 hashes
  const submittedHash = crypto.createHash('sha256').update(submittedPin).digest();
  const expectedHash = crypto.createHash('sha256').update(expectedPin).digest();

  const isMatch = crypto.timingSafeEqual(submittedHash, expectedHash);

  if (!isMatch) {
    recordFailedAttempt(clientIp);
    return res.status(401).json({
      success: false,
      error: 'Incorrect PIN. Please check with the family hosts.'
    });
  }

  // Clear failed attempts upon successful verification
  clearAttempts(clientIp);

  // Generate cryptographic HMAC session token
  const secret = process.env.SESSION_SECRET || 'wedding-tanishq-shivangee-secure-salt-2027';
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');
  const sessionToken = `${timestamp}.${hmac}`;

  // Set Secure HttpOnly cookie
  const isProd = process.env.NODE_ENV === 'production';
  const cookieFlags = [
    `host_session=${sessionToken}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=86400',
    isProd ? 'Secure' : ''
  ].filter(Boolean).join('; ');

  res.setHeader('Set-Cookie', cookieFlags);

  return res.status(200).json({
    success: true,
    token: sessionToken,
    message: 'Host authentication successful'
  });
}

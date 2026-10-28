// Vercel Serverless Function: Secure Host PIN Verification
import crypto from 'crypto';

import { rateLimit, sameOrigin } from '../server/request-controls.js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Cache-Control','no-store');
  if (!sameOrigin(req)) return res.status(403).json({success:false});

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid request body' });
    }
  }

  const submittedPin = (body?.pin || '').toString().trim();
  const expectedPin = (process.env.HOST_DASHBOARD_PIN || process.env.ADMIN_PIN || '').toString().trim();

  if (expectedPin.length < 8 || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) return res.status(503).json({ success: false, error: 'Host authentication configuration missing.' });

  try {
    if (!await rateLimit(req,'host-login',null,6,900)) return res.status(429).json({success:false,error:'Too many login attempts. Please wait 15 minutes.'});
  } catch { return res.status(503).json({success:false,error:'Host authentication unavailable.'}); }

  // Timing safe comparison using SHA-256 hashes
  const submittedHash = crypto.createHash('sha256').update(submittedPin).digest();
  const expectedHash = crypto.createHash('sha256').update(expectedPin).digest();

  const isMatch = crypto.timingSafeEqual(submittedHash, expectedHash);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Incorrect PIN. Please check with the family hosts.'
    });
  }

  // Clear failed attempts upon successful verification

  // Generate cryptographic HMAC session token
  const secret = process.env.SESSION_SECRET;
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

// Vercel Serverless Function: Test Google Sheets Webhook Connection
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const webhookUrl = body?.webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com/macros/s/')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Google Apps Script Webhook URL. It must start with https://script.google.com/macros/s/'
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const testPayload = {
      submission_id: 'test-ping-' + Date.now(),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      guest_name: 'System Diagnostic Test',
      phone: "'9999999999",
      side: 'Hosts Connection Test',
      attending: 'Joyfully Attending',
      guest_count: 1,
      arrival_date: '14 February 2027',
      arrival_time: '10:00 AM',
      blessing_message: 'Testing Google Sheet RSVP Connection for Tanishq & Shivangee',
      ganesh_poojan: 'YES',
      haldi_carnival: 'YES',
      sangeet: 'YES',
      wedding: 'YES',
      arrival_info: 'Diagnostic Test',
      needs_accommodation: 'No'
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(testPayload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Successfully connected to Google Sheet! The diagnostic test row was received.',
        response: data
      });
    } else {
      return res.status(response.status).json({
        success: false,
        error: `Google Apps Script returned status ${response.status}`,
        details: text
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `Connection failed: ${err.message}`
    });
  }
}

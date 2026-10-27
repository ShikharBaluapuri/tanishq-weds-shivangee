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

    const now = new Date();
    const testPayload = {
      rsvp_id: 'test-ping-' + Date.now(),
      submission_date: now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }),
      submission_time: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
      guest_name: 'Diagnostic Connection Test',
      phone: "'9999999999",
      side: 'Hosts Connection Test',
      attending: 'Joyfully Attending',
      guest_count: 1,
      events_attending: 'All Wedding Functions',
      arrival_date: '14 February 2027',
      arrival_time: '10:00 AM',
      blessing_message: 'Testing Google Sheet RSVP Connection for Tanishq & Shivangee',
      whatsapp_consent: 'Opted In',
      notification_status: 'Diagnostic Ping',
      sheets_sync_status: 'Synced',
      last_updated: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
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
      let errorMsg = `Google Apps Script returned status ${response.status}`;
      if (response.status === 401) {
        errorMsg = 'Google Apps Script returned status 401 (Unauthorized): In Apps Script, click Deploy > Manage deployments > Edit (pencil) > set "Who has access" to "Anyone" (currently set to "Only myself"), select "New version", and click Deploy.';
      }
      return res.status(200).json({
        success: false,
        error: errorMsg,
        status: response.status,
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

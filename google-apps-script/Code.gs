// Deploy as the spreadsheet owner's web app. Set RSVP_WEBHOOK_SECRET in Script Properties.
// The secret must match Vercel GOOGLE_SHEETS_WEBHOOK_SECRET (at least 32 random characters).
const SPREADSHEET_ID = '1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y';
const WORKSHEET_NAME = 'Sheet1';
const PROTOCOL = 'wedding-rsvp-v2';
const HEADERS = ['RSVP ID','Submission Date','Submission Time','Guest / Family Name','WhatsApp Number','Guest Side','Attendance Status','Number of Guests','Selected Wedding Events','Expected Arrival Date','Expected Arrival Time','Blessing / Message','WhatsApp Consent','Notification Status','Google Sheets Sync Status','Last Updated','Arrival Mode'];
function output(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function targetSheet() {
  let ss;
  try { ss = SpreadsheetApp.openById(SPREADSHEET_ID); } catch (_) { throw new Error('Spreadsheet Not Accessible'); }
  const sheet = ss.getSheetByName(WORKSHEET_NAME);
  if (!sheet || ss.getId() !== SPREADSHEET_ID) throw new Error('Spreadsheet Not Accessible');
  const headers = sheet.getRange(1,1,1,HEADERS.length).getDisplayValues()[0];
  // Never overwrite occupied headers or fall back to another spreadsheet/tab.
  if (headers.some((h,i) => h !== HEADERS[i])) throw new Error('Header Mismatch');
  return sheet;
}
function doGet() { return output({ protocol: PROTOCOL, success: false, error: 'Authentication Failed' }); }
function doPost(e) {
  let lock;
  try {
    const envelope = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('RSVP_WEBHOOK_SECRET');
    if (!secret || secret.length < 32 || typeof envelope.message !== 'string' || envelope.message.length > 12000) throw new Error('Authentication Failed');
    const signature = Utilities.computeHmacSha256Signature(envelope.message, secret).map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
    if (signature !== envelope.signature) throw new Error('Authentication Failed');
    const request = JSON.parse(envelope.message);
    if (!Number.isFinite(request.timestamp) || Math.abs(Date.now() - request.timestamp) > 300000) throw new Error('Authentication Failed');
    lock = LockService.getScriptLock();
    lock.waitLock(8000);
    const sheet = targetSheet();
    const base = { success: true, protocol: PROTOCOL, action: request.action, request_id: request.nonce, spreadsheet_id: SPREADSHEET_ID, worksheet: WORKSHEET_NAME };
    // Exercise the same authorized Sheets API used for writes, including service setup.
    Sheets.Spreadsheets.get(SPREADSHEET_ID, { fields: 'spreadsheetId,sheets.properties' });
    if (!sheet.getRange('A:Q').canEdit()) throw new Error('Spreadsheet Not Accessible');
    if (request.action === 'health') return output(base);
    const data = sheet.getLastRow() > 1 ? (Sheets.Spreadsheets.Values.get(SPREADSHEET_ID, "'Sheet1'!A2:Q"+sheet.getLastRow(), { valueRenderOption: 'FORMATTED_VALUE' }).values || []) : [];
    const p = request.payload || {};
    if (request.action === 'list') return output(Object.assign(base, { rows: data }));
    if (!/^RSVP-[0-9a-f-]{36}$/.test(p.rsvp_id || '')) throw new Error('Invalid RSVP');
    const matches = data.map((row,i) => ({ row, index: i+2 })).filter(r => r.row[0] === p.rsvp_id);
    if (request.action === 'read') return output(Object.assign(base, { matches: matches.length, values: matches.length === 1 ? matches[0].row : null }));
    if (request.action !== 'save' || matches.length > 1) throw new Error('RSVP Conflict');
    if (!p.guest_name || !/^[1-9]\d{9,14}$/.test(p.phone) || !['Joyfully Attending','Regretfully Declining'].includes(p.attending) || !Number.isInteger(p.guest_count) || p.guest_count < 0 || p.guest_count > 10 || !Array.isArray(p.events_attending)) throw new Error('Invalid RSVP');
    // Never overwrite another guest by guessing a phone number or existing RSVP ID.
    if (matches.length && matches[0].row[4] !== p.phone) throw new Error('RSVP Conflict');
    if (data.some(row => String(row[4] || '').replace(/\D/g,'').replace(/^(\d{10})$/, '91$1') === p.phone && row[0] !== p.rsvp_id)) throw new Error('RSVP Conflict');
    const values = [p.rsvp_id,p.submission_date,p.submission_time,p.guest_name,p.phone,p.side,p.attending,String(p.guest_count),p.events_attending.join('; '),p.arrival_date,p.arrival_time,p.blessing_message,p.community_consent ? 'Opted In' : 'Not Opted In','Pending Manual Dispatch','Synced',p.last_updated,p.arrival_mode || ''].map(v => String(v == null ? '' : v));
    if (matches.length) { values[1] = matches[0].row[1]; values[2] = matches[0].row[2]; }
    if (matches.length && Date.parse(matches[0].row[15]) > Date.parse(p.last_updated)) throw new Error('RSVP Conflict');
    const row = matches.length ? matches[0].index : sheet.getLastRow() + 1;
    // Sheets API RAW preserves guest strings exactly, without formula interpretation.
    Sheets.Spreadsheets.Values.update({ values: [values] }, SPREADSHEET_ID, "'Sheet1'!A"+row+':Q'+row, { valueInputOption: 'RAW' });
    const actual = Sheets.Spreadsheets.Values.get(SPREADSHEET_ID, "'Sheet1'!A"+row+':Q'+row, { valueRenderOption: 'FORMATTED_VALUE' }).values[0];
    while (actual.length < 17) actual.push('');
    if (JSON.stringify(actual) !== JSON.stringify(values)) throw new Error('Synchronization Failed');
    return output(Object.assign(base, { rsvp_id: p.rsvp_id, row: row, values: actual }));
  } catch (error) {
    const allowed = ['Authentication Failed','Spreadsheet Not Accessible','Header Mismatch','RSVP Conflict'];
    return output({ success: false, error: allowed.indexOf(error.message) >= 0 ? error.message : 'Synchronization Failed' });
  } finally { if (lock && lock.hasLock()) lock.releaseLock(); }
}

// Select this function in the editor and Run to authorize and verify read access.
// It does not create an RSVP or modify spreadsheet data.
function verifySetup() {
  const sheet = targetSheet();
  Sheets.Spreadsheets.get(SPREADSHEET_ID, { fields: 'spreadsheetId' });
  if (!sheet.getRange('A:Q').canEdit()) throw new Error('Spreadsheet Not Accessible');
  console.log('Authorized spreadsheet and Sheet1 access verified.');
}

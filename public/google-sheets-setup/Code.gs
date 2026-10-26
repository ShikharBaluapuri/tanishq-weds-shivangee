/**
 * ==============================================================================
 * TANISHQ & SHIVANGEE — OFFICIAL WEDDING RSVP AUTOMATION SCRIPT
 * ==============================================================================
 *
 * Target Google Spreadsheet:
 * URL: https://docs.google.com/spreadsheets/d/1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y/edit
 * ID:  1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y
 * Title: "T&S Wedding RSVPs"
 * Worksheet: "Sheet1"
 *
 * Exact 16 Standardized Columns (A to P):
 * A: RSVP ID
 * B: Submission Date
 * C: Submission Time
 * D: Guest / Family Name
 * E: WhatsApp Number
 * F: Guest Side
 * G: Attendance Status
 * H: Number of Guests
 * I: Selected Wedding Events
 * J: Expected Arrival Date
 * K: Expected Arrival Time
 * L: Blessing / Message
 * M: WhatsApp Consent
 * N: Notification Status
 * O: Google Sheets Sync Status
 * P: Last Updated
 */

const SPREADSHEET_ID = '1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y';
const WORKSHEET_NAME = 'Sheet1';

const HEADERS = [
  'RSVP ID',                     // Col A
  'Submission Date',            // Col B
  'Submission Time',            // Col C
  'Guest / Family Name',        // Col D
  'WhatsApp Number',            // Col E
  'Guest Side',                 // Col F
  'Attendance Status',          // Col G
  'Number of Guests',           // Col H
  'Selected Wedding Events',    // Col I
  'Expected Arrival Date',      // Col J
  'Expected Arrival Time',      // Col K
  'Blessing / Message',         // Col L
  'WhatsApp Consent',           // Col M
  'Notification Status',        // Col N
  'Google Sheets Sync Status',  // Col O
  'Last Updated'                // Col P
];

function getTargetSheet() {
  let ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  if (!ss) {
    throw new Error('Unable to open target spreadsheet with ID: ' + SPREADSHEET_ID);
  }

  let sheet = ss.getSheetByName(WORKSHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    try {
      sheet.setName(WORKSHEET_NAME);
    } catch (e) {}
  }

  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#2C3E34');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setFontFamily('Georgia');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);

    for (let c = 1; c <= HEADERS.length; c++) {
      sheet.autoResizeColumn(c);
    }
  }

  return sheet;
}

function sanitizeCell(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (/^[=+\-@]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Lock acquisition timeout: ' + err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const sheet = getTargetSheet();
    const data = sheet.getDataRange().getValues();

    const rsvpId = sanitizeCell(payload.rsvp_id || ('RSVP-2027-' + Date.now().toString(36).toUpperCase()));
    const now = new Date();
    const defaultDate = Utilities.formatDate(now, 'Asia/Kolkata', 'dd MMMM yyyy');
    const defaultTime = Utilities.formatDate(now, 'Asia/Kolkata', 'hh:mm a') + ' IST';
    
    const submissionDate = sanitizeCell(payload.submission_date || payload.submitted_date || defaultDate);
    const submissionTime = sanitizeCell(payload.submission_time || payload.submitted_time || defaultTime);
    const guestName = sanitizeCell(payload.guest_name || '');

    let rawPhone = String(payload.phone || payload.raw_phone || '').replace(/\D/g, '');
    const phone = "'" + rawPhone;

    const side = sanitizeCell(payload.side || 'Friends & Colleagues');
    const attending = sanitizeCell(payload.attending || 'Joyfully Attending');
    const guestCount = attending === 'Regretfully Declining' ? 0 : (Number(payload.guest_count) || 1);

    let events = '';
    if (Array.isArray(payload.events_attending)) {
      events = sanitizeCell(payload.events_attending.join('; '));
    } else {
      events = sanitizeCell(payload.events_attending || payload.events || (attending === 'Joyfully Attending' ? 'All Wedding Functions' : 'None'));
    }

    const arrivalDate = sanitizeCell(payload.arrival_date || (attending === 'Joyfully Attending' ? '14 February 2027' : 'Not Attending'));
    const arrivalTime = sanitizeCell(payload.arrival_time || (attending === 'Joyfully Attending' ? '10:30 AM' : ''));
    const blessing = sanitizeCell(payload.blessing_message || '');
    const consent = sanitizeCell(payload.whatsapp_consent || (payload.community_consent ? 'Opted In' : 'Not Opted In'));
    const notificationStatus = sanitizeCell(payload.notification_status || payload.whatsapp_notify_status || 'Pending Manual Dispatch');
    const syncStatus = 'Synced';
    const lastUpdated = Utilities.formatDate(now, 'Asia/Kolkata', 'dd MMMM yyyy, hh:mm:ss a') + ' IST';

    const rowValues = [
      rsvpId, submissionDate, submissionTime, guestName, phone, side, attending, guestCount,
      events, arrivalDate, arrivalTime, blessing, consent, notificationStatus, syncStatus, lastUpdated
    ];

    let targetRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      const rowRsvpId = String(data[i][0] || '').trim();
      const rowPhone = String(data[i][4] || '').replace(/\D/g, '');

      if ((rsvpId && rowRsvpId === rsvpId) || (rawPhone && rowPhone === rawPhone)) {
        targetRowIndex = i + 1;
        break;
      }
    }

    let action = 'inserted';
    if (targetRowIndex > 0) {
      if (data[targetRowIndex - 1][0]) rowValues[0] = data[targetRowIndex - 1][0];
      if (data[targetRowIndex - 1][1]) rowValues[1] = data[targetRowIndex - 1][1];
      if (data[targetRowIndex - 1][2]) rowValues[2] = data[targetRowIndex - 1][2];

      sheet.getRange(targetRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
      action = 'updated';
    } else {
      sheet.appendRow(rowValues);
      targetRowIndex = sheet.getLastRow();
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      action: action,
      rsvp_id: rowValues[0],
      row: targetRowIndex,
      spreadsheet_id: SPREADSHEET_ID,
      worksheet: WORKSHEET_NAME,
      guest_name: guestName,
      timestamp: lastUpdated
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    const sheet = getTargetSheet();
    return ContentService.createTextOutput(JSON.stringify({
      status: 'online',
      spreadsheet_id: SPREADSHEET_ID,
      worksheet: WORKSHEET_NAME,
      columns_configured: HEADERS.length,
      headers: HEADERS,
      total_records: Math.max(0, sheet.getLastRow() - 1),
      timestamp: Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMMM yyyy, hh:mm:ss a') + ' IST'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      error: err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

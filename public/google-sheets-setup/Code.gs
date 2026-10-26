/**
 * TANISHQ & SHIVANGEE — WEDDING RSVP 2027
 * OFFICIAL GOOGLE SHEETS & GOOGLE DRIVE AUTOMATION SCRIPT
 *
 * Folder:      "Tanishq & Shivangee — Wedding RSVP"
 * Spreadsheet: "Tanishq & Shivangee — Wedding RSVP 2027"
 */

const FOLDER_NAME = 'Tanishq & Shivangee — Wedding RSVP';
const SHEET_NAME = 'Tanishq & Shivangee — Wedding RSVP 2027';

const HEADERS = [
  'RSVP ID',
  'Submission Date & Time',
  'Guest / Family Name',
  'WhatsApp Number',
  'Guest Side',
  'Attendance Status',
  'Number of Guests',
  'Selected Wedding Functions',
  'Expected Arrival Date',
  'Expected Arrival Time',
  'Wedding Blessing / Message',
  'Community Invitation Status',
  'WhatsApp Notification Status',
  'Last Updated'
];

function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(FOLDER_NAME);
}

function getOrCreateSpreadsheet() {
  const folder = getOrCreateFolder();
  const files = folder.getFilesByName(SHEET_NAME);
  
  let spreadsheet;
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(SHEET_NAME);
    const file = DriveApp.getFileById(spreadsheet.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
  }
  
  let sheet = spreadsheet.getSheetByName('RSVP Records');
  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
    sheet.setName('RSVP Records');
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#2C3E34');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setFontFamily('Georgia');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    for (let c = 1; c <= HEADERS.length; c++) sheet.autoResizeColumn(c);
  }
  
  return sheet;
}

function sanitizeCell(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (/^[=+\-@]/.test(str)) return "'" + str;
  return str;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Spreadsheet write lock timeout: ' + err.message
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

    const sheet = getOrCreateSpreadsheet();
    const data = sheet.getDataRange().getValues();
    
    const rsvpId = sanitizeCell(payload.rsvp_id || payload.id || ('RSVP-' + Date.now().toString(36).toUpperCase()));
    const timestampIST = sanitizeCell(payload.submitted_at || payload.timestamp || Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a'));
    const guestName = sanitizeCell(payload.guest_name || '');
    
    let rawPhone = String(payload.phone || '').trim();
    if (rawPhone.startsWith('+')) rawPhone = rawPhone.substring(1);
    rawPhone = rawPhone.replace(/\D/g, '');
    const phone = "'" + rawPhone;
    
    const side = sanitizeCell(payload.side || 'Friends & Colleagues');
    const attending = sanitizeCell(payload.attending || 'Joyfully Attending');
    const guestCount = attending === 'Regretfully Declining' ? 0 : (Number(payload.guest_count) || 1);
    
    let functions = '';
    if (Array.isArray(payload.events_attending)) {
      functions = sanitizeCell(payload.events_attending.join('; '));
    } else {
      functions = sanitizeCell(payload.events_attending || payload.functions || (attending === 'Joyfully Attending' ? 'All Functions' : 'None'));
    }
    
    const arrivalDate = sanitizeCell(payload.arrival_date || (attending === 'Joyfully Attending' ? '14 February 2027' : 'Not Attending'));
    const arrivalTime = sanitizeCell(payload.arrival_time || (attending === 'Joyfully Attending' ? '10:30 AM' : ''));
    const blessing = sanitizeCell(payload.blessing_message || '');
    const communityStatus = sanitizeCell(payload.community_invite_status || (payload.community_consent ? 'Invitation Available' : 'Not Opted In'));
    const whatsappStatus = sanitizeCell(payload.whatsapp_notify_status || 'Pending Manual Dispatch');
    const lastUpdated = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm:ss a');

    const rowValues = [
      rsvpId,
      timestampIST,
      guestName,
      phone,
      side,
      attending,
      guestCount,
      functions,
      arrivalDate,
      arrivalTime,
      blessing,
      communityStatus,
      whatsappStatus,
      lastUpdated
    ];

    let existingRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      const rowRsvpId = String(data[i][0] || '').trim();
      const rowPhone = String(data[i][3] || '').replace(/\D/g, '');
      
      if ((rsvpId && rowRsvpId === rsvpId) || (rawPhone && rowPhone === rawPhone)) {
        existingRowIndex = i + 1;
        break;
      }
    }

    let action = 'inserted';
    if (existingRowIndex > 0) {
      if (data[existingRowIndex - 1][0]) rowValues[0] = data[existingRowIndex - 1][0];
      if (data[existingRowIndex - 1][1]) rowValues[1] = data[existingRowIndex - 1][1];
      sheet.getRange(existingRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
      action = 'updated';
    } else {
      sheet.appendRow(rowValues);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      action: action,
      rsvp_id: rowValues[0],
      guest_name: guestName,
      row: existingRowIndex > 0 ? existingRowIndex : sheet.getLastRow(),
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
    const sheet = getOrCreateSpreadsheet();
    return ContentService.createTextOutput(JSON.stringify({
      status: 'online',
      spreadsheet_name: SHEET_NAME,
      folder_name: FOLDER_NAME,
      spreadsheet_id: sheet.getParent().getId(),
      columns_configured: HEADERS.length,
      headers: HEADERS,
      total_records: Math.max(0, sheet.getLastRow() - 1),
      timestamp: Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm:ss a')
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      error: err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Runs the actual Code.gs against an isolated, in-memory Google API adapter.
// No credentials, external requests, or production writes are involved.
import vm from 'node:vm';
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { SPREADSHEET_ID } from '../server/sheets.js';
export const HEADERS = ['RSVP ID','Submission Date','Submission Time','Guest / Family Name','WhatsApp Number','Guest Side','Attendance Status','Number of Guests','Selected Wedding Events','Expected Arrival Date','Expected Arrival Time','Blessing / Message','WhatsApp Consent','Notification Status','Google Sheets Sync Status','Last Updated','Arrival Mode'];
export const TEST_SECRET = 'local-test-only-secret-never-use-in-production';
export function scriptAdapter() {
  const rows = [HEADERS.slice()];
  const state = { rows, writes: 0, reads: 0, locked: false, failWrite: false, failRead: false, loseResponse: false, inaccessible: false, editable: true, mismatch: false };
  const rangeRead = (range) => {
    const match = /!A(\d+):Q(\d+)/.exec(range);
    return rows.slice(Number(match[1])-1, Number(match[2])).map(row => row.slice());
  };
  const sheet = {
    getLastRow: () => rows.length,
    getRange: () => ({ getDisplayValues: () => [rows[0]], canEdit: () => state.editable })
  };
  const context = vm.createContext({ console, Date, JSON,
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => TEST_SECRET }) },
    Utilities: { computeHmacSha256Signature: (text, key) => [...crypto.createHmac('sha256', key).update(text).digest()] },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: text => ({ text, setMimeType() { return this; } }) },
    SpreadsheetApp: { openById: id => { assert.equal(id, SPREADSHEET_ID); if (state.inaccessible) throw Error('Denied'); return { getId: () => id, getSheetByName: name => name === 'Sheet1' ? sheet : null }; } },
    LockService: { getScriptLock: () => ({ waitLock() { assert.equal(state.locked, false); state.locked = true; }, hasLock: () => state.locked, releaseLock() { state.locked = false; } }) },
    Sheets: { Spreadsheets: {
      get(id) { assert.equal(id, SPREADSHEET_ID); return { spreadsheetId: id }; },
      Values: {
        update({ values }, id, range, options) {
          assert.equal(state.locked, true); assert.equal(id, SPREADSHEET_ID); assert.equal(options.valueInputOption, 'RAW');
          if (state.failWrite) throw Error('Service unavailable');
          rows[Number(/!A(\d+)/.exec(range)[1])-1] = values[0].slice(); state.writes++;
        },
        get(id, range) {
          assert.equal(id, SPREADSHEET_ID); state.reads++;
          if (state.failRead) throw Error('Service unavailable');
          const values = rangeRead(range);
          if (state.mismatch && values[0]) values[0][11] = 'CORRUPTED';
          return { values };
        }
      }
    } }
  });
  vm.runInContext(fs.readFileSync(new URL('../google-apps-script/Code.gs', import.meta.url), 'utf8'), context);
  state.invoke = envelope => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(envelope) } }).text);
  state.fetch = async (url, options) => {
    assert.equal(url, 'https://script.google.com/macros/s/local-test/exec');
    if(options.method==='GET')return Response.json(JSON.parse(context.doGet().text));
    const result = state.invoke(JSON.parse(options.body));
    if (state.loseResponse && JSON.parse(JSON.parse(options.body).message).action === 'save') { state.loseResponse = false; throw Error('Response lost after commit'); }
    return Response.json(result);
  };
  return state;
}
export function configureTestEnvironment() {
  for (const key of ['SUPABASE_URL','VITE_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','SUPABASE_SECRET_KEY']) delete process.env[key];
  process.env.GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/local-test/exec';
  process.env.GOOGLE_SHEETS_WEBHOOK_SECRET = TEST_SECRET;
  process.env.SESSION_SECRET = TEST_SECRET;
  process.env.HOST_DASHBOARD_PIN = 'local-test-pin';
  process.env.RATE_LIMIT_SECRET = TEST_SECRET;
}
export function guest(overrides = {}) {
  return { rsvp_id: `RSVP-${crypto.randomUUID()}`, guest_name: 'LOCAL TEST — NEVER SENT TO GOOGLE', phone: '919000000001', side: 'Friends & Colleagues', attending: 'Joyfully Attending', guest_count: 2, events_attending: ['Ganesh Poojan & Mamera (14th Feb, 9 AM)'], arrival_date: '14 February 2027', arrival_time: '10:30 AM', blessing_message: '=HYPERLINK("https://example.invalid")', community_consent: false, ...overrides };
}
export function responseRecorder() {
  return { statusCode: 200, headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(code) { this.statusCode=code; return this; }, json(body) { this.body=body; return this; } };
}

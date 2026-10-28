import { sheetsRequest } from '../server/sheets.js';
try {
  const result = await sheetsRequest('health');
  console.log(JSON.stringify({ status: 'Connected', spreadsheetId: result.spreadsheet_id, worksheet: result.worksheet, note: 'Read access verified. No RSVP written.' }));
} catch (error) {
  console.error(error.code || 'Synchronization Failed');
  process.exitCode = 1;
}

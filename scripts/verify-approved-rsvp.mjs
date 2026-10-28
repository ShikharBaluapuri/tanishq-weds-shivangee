// Restricted to the one production test record explicitly approved by the host.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { sheetsRequest } from '../server/sheets.js';
const id='RSVP-0c34038f-f8a5-458a-a272-7e34f1ad5dfc';
const client=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const {data,error}=await client.from('wedding_rsvps').select('payload').eq('rsvp_id',id).single();
assert.equal(error,null);
const p=data.payload;
assert.equal(p.guest_name,'TEST RSVP — DELETE AFTER VERIFICATION');
assert.equal(p.phone,'910000000000');
const expected=[p.rsvp_id,p.submission_date,p.submission_time,p.guest_name,p.phone,p.side,p.attending,String(p.guest_count),p.events_attending.join('; '),p.arrival_date,p.arrival_time,p.blessing_message,p.community_consent?'Opted In':'Not Opted In','Pending Manual Dispatch','Synced',p.last_updated,p.arrival_mode||''];
const results=[];
for(let pass=1;pass<=2;pass++) {
  const response=await fetch('https://tanishqwedsshivangee.vercel.app/api/rsvp',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p),signal:AbortSignal.timeout(110000)
  });
  const result=await response.json();
  assert.equal(response.status,200,'Live API must confirm verified synchronization');
  assert.equal(result.data?.rsvp_id,id);
  assert.equal(result.sync?.supabase,true);
  assert.equal(result.sync?.googleSheets,true);
  const read=await sheetsRequest('read',{rsvp_id:id});
  assert.equal(read.matches,1,'Exactly one spreadsheet row must match');
  assert.deepEqual(read.values,expected,'All 17 spreadsheet fields must match');
  const {data:stored,error:readError}=await client.from('wedding_rsvps').select('rsvp_id,sheets_sync_status,payload').eq('rsvp_id',id);
  assert.equal(readError,null);assert.equal(stored.length,1);assert.equal(stored[0].sheets_sync_status,'synced');
  assert.deepEqual(stored[0].payload,p);
  results.push({pass,httpStatus:response.status,id,sheetMatches:read.matches,matchedFields:expected.length,databaseMatches:stored.length,status:'synced'});
  console.log(JSON.stringify(results.at(-1)));
}
fs.mkdirSync('tests/.generated',{recursive:true});
fs.writeFileSync('tests/.generated/production-verification.json',JSON.stringify({verifiedAt:new Date().toISOString(),spreadsheetId:'1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y',worksheet:'Sheet1',expected,results},null,2));

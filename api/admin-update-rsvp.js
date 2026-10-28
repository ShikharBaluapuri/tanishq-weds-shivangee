import { verifySession } from '../server/auth.js';
import { sameOrigin } from '../server/request-controls.js';
import { validateSubmission } from '../server/validation.js';
import { updateRecord } from '../server/store.js';

export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({success:false});
  if(!verifySession(req))return res.status(401).json({success:false});
  if(!sameOrigin(req))return res.status(403).json({success:false});
  let record,revision;
  try {
    const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
    revision=body?.revision;
    if(!Number.isInteger(revision)||revision<1)throw Error();
    record=validateSubmission(body);
  } catch { return res.status(400).json({success:false,error:'Invalid RSVP update.'}); }
  record.last_updated=new Date().toISOString();
  try {
    const result=await updateRecord(record,revision);
    return res.status(202).json({success:true,status:'pending',data:result.record,revision:result.revision});
  } catch(error) { return res.status(error.code==='RSVP Conflict'?409:503).json({success:false,error:'Update could not be saved. Refresh the record before retrying.'}); }
}

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
const origin=process.argv[2];
const production=process.argv.includes('--production');
if(!/^https:\/\/tanishqwedsshivangee-[a-z0-9]+-code-z6\.vercel\.app$/.test(origin))throw Error('Unexpected deployment');
const cache=path.join(process.env.TEMP,'ts-vercel-cli-recovery','_npx');
let cli;
for(const entry of fs.readdirSync(cache))try{
  const root=path.join(cache,entry,'node_modules','vercel');
  const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
  if(pkg.version==='65.4.0'){cli=path.join(root,pkg.bin.vercel);break;}
}catch{ /* Cache entry has no Vercel CLI. */ }
if(!cli)throw Error('CLI unavailable');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'wedding-smoke-'));
function request(route,method='GET',body,token) {
  const headers=['Content-Type: application/json'];
  if(token)headers.push('Authorization: Bearer '+token);
  fs.writeFileSync(path.join(temp,'headers'),headers.join('\n'));
  const args=[cli,'--scope','code-z6','curl',origin+route,'--','--silent','--show-error','--max-time','110','--request',method,'--header','@'+path.join(temp,'headers'),'--write-out','\n%{http_code}'];
  if(body!==undefined){fs.writeFileSync(path.join(temp,'body'),JSON.stringify(body));args.push('--data-binary','@'+path.join(temp,'body'));}
  const r=spawnSync(process.execPath,args,{encoding:'utf8',timeout:120000});
  if(r.status!==0)throw Error('Protected deployment request failed');
  const split=r.stdout.trimEnd().lastIndexOf('\n');
  const text=r.stdout.slice(0,split);const status=Number(r.stdout.slice(split+1));
  let json;try{json=JSON.parse(text);}catch{ /* HTML root page. */ }
  return {status,json,text};
}
function requireStatus(label,result,expected){if(result.status!==expected)throw Error(label+' returned '+result.status);console.log(label+': HTTP '+result.status);}
try {
  const root=request('/');requireStatus('Website',root,200);if(!root.text.includes('Tanishq &amp; Shivangee'))throw Error('Wrong website');
  requireStatus('Guest records protected',request('/api/admin-rsvps'),401);
  requireStatus('Invalid RSVP rejected',request('/api/rsvp','POST',{}),400);
  requireStatus('Worker protected',request('/api/sync-rsvps','POST',{}),production?401:503);
  if(production) {
    const login=request('/api/verify-pin','POST',{pin:process.env.HOST_DASHBOARD_PIN});requireStatus('Host authentication',login,200);
    const token=login.json?.token;if(!token)throw Error('Host session missing');
    const health=request('/api/test-sheets','POST',{},token);requireStatus('Authorized integration health',health,200);
    if(health.json?.status!=='Connected')throw Error('Integration is not connected');
    requireStatus('Primary database dashboard',request('/api/admin-rsvps','GET',undefined,token),200);
    const worker=request('/api/sync-rsvps','POST',{},process.env.SYNC_WORKER_SECRET);requireStatus('Worker empty queue',worker,200);
    if(worker.json?.processedCount!==0)throw Error('Unexpected production queue record');
  }
  console.log(JSON.stringify({passed:true,production,noRsvpWritten:true}));
} finally {
  for(const name of ['headers','body'])try{fs.unlinkSync(path.join(temp,name));}catch{ /* Missing file. */ }
  fs.rmdirSync(temp);
}

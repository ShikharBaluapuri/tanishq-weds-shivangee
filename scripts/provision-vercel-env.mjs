// Run with --env-file=.env.local. Secrets travel over stdin, never command arguments.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const project='prj_7xzg4oOuVMEYtDBCW0DUyO2Q2QZN';
const linked=JSON.parse(fs.readFileSync('.vercel/project.json','utf8'));
if(linked.projectId!==project || linked.orgId!=='team_tkqvOr8rvGmnPQZdSzoJUJoK')throw Error('Unexpected deployment target');
const root=path.join(process.env.TEMP,'ts-vercel-cli-recovery','_npx');
let cli;
for(const entry of fs.readdirSync(root)) {
  const directory=path.join(root,entry,'node_modules','vercel');
  try {
    const pkg=JSON.parse(fs.readFileSync(path.join(directory,'package.json'),'utf8'));
    if(pkg.version==='65.4.0'){cli=path.join(directory,pkg.bin.vercel);break;}
  } catch { /* Other cache entries are irrelevant. */ }
}
if(!cli)throw Error('Pinned Vercel CLI not available');
const names=['SUPABASE_URL','SUPABASE_SECRET_KEY','GOOGLE_SHEETS_WEBHOOK_URL','GOOGLE_SHEETS_WEBHOOK_SECRET','SESSION_SECRET','HOST_DASHBOARD_PIN','RATE_LIMIT_SECRET','SYNC_WORKER_SECRET'];
for(const name of names) {
  const value=process.env[name];
  if(!value)throw Error('Missing '+name);
  const result=spawnSync(process.execPath,[cli,'--scope','code-z6','env','add',name,'--environment','production','--project',project,'--sensitive','--force','--yes'],{input:value+'\n',encoding:'utf8',timeout:45000});
  if(result.status!==0)throw Error('Vercel configuration failed for '+name+' (secret output suppressed)');
  console.log(name+': configured for Production');
}

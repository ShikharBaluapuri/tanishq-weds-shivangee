import { createClient } from '@supabase/supabase-js';
const client=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const enabled=process.argv.includes('--enable');
const {data,error}=await client.rpc('configure_wedding_worker',{worker_token:process.env.SYNC_WORKER_SECRET,enabled});
if(error || data!==true){console.error('Worker scheduler configuration failed.');process.exitCode=1;}
else console.log(JSON.stringify({configured:true,enabled}));

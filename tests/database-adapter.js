// Isolated HTTP contract fixture. Real SQL behavior is tested in primary-schema.test.js.
export function databaseAdapter(google) {
  process.env.SUPABASE_URL='https://database.example.invalid';
  process.env.SUPABASE_SECRET_KEY='local-test-secret';
  const rows=new Map();
  return async (input,options={})=>{
    const url=String(input);
    if(url.startsWith('https://script.google.com/'))return google.fetch(input,options);
    if(!url.startsWith('https://database.example.invalid/rest/v1/'))throw Error('Unexpected external request');
    if(url.endsWith('/rpc/take_wedding_request')) return Response.json(true);
    if(url.endsWith('/rpc/ack_wedding_sync')) {
      const {job_id}=JSON.parse(options.body);rows.get(job_id).sheets_sync_status='synced';return Response.json(true);
    }
    if(url.endsWith('/rpc/accept_wedding_rsvp')) {
      const {incoming}=JSON.parse(options.body);
      const old=rows.get(incoming.rsvp_id);
      if([...rows.values()].some(r=>r.payload.phone===incoming.phone&&r.payload.rsvp_id!==incoming.rsvp_id))return Response.json({}, {status:409});
      if(old&&old.payload.blessing_message!==incoming.blessing_message)return Response.json({}, {status:409});
      if(!old)rows.set(incoming.rsvp_id,{payload:incoming,sheets_sync_status:'pending'});
      return Response.json({record:rows.get(incoming.rsvp_id).payload});
    }
    if(options.method==='PATCH') {
      const id=new URL(url).searchParams.get('rsvp_id').slice(3);
      Object.assign(rows.get(id),JSON.parse(options.body));return new Response(null,{status:204});
    }
    return Response.json([...rows.values()].filter(r=>!url.includes('sheets_sync_status=eq.pending')||r.sheets_sync_status==='pending'));
  };
}

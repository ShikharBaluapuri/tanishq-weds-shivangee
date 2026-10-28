import test, { before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import fs from 'node:fs/promises';
import { createServer } from 'vite';
import { scriptAdapter, configureTestEnvironment } from './apps-script-adapter.js';
import { databaseAdapter } from './database-adapter.js';

let dom, server, origin, google, databaseFetch, databaseDown = false, pendingMode = false, React, render, fireEvent, screen, waitFor, cleanup, Modal;
const nativeFetch = globalThis.fetch;
before(async () => {
  configureTestEnvironment();
  dom = new JSDOM('<!doctype html><html><body></body></html>', { url:'http://localhost', pretendToBeVisual:true });
  for (const name of ['window','document','HTMLElement','Element','SVGElement','Node','MutationObserver','CustomEvent','localStorage','sessionStorage']) globalThis[name]=dom.window[name];
  Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
  globalThis.requestAnimationFrame = cb => setTimeout(cb,0);
  globalThis.cancelAnimationFrame = clearTimeout;
  React = await import('react');
  ({render,fireEvent,screen,waitFor,cleanup} = await import('@testing-library/react'));
  await fs.mkdir(new URL('./.generated/',import.meta.url),{recursive:true});
  await build({entryPoints:['src/components/RsvpModal.jsx'],outfile:'tests/.generated/modal.mjs',bundle:true,platform:'node',format:'esm',packages:'external',define:{'import.meta.env':'{}'},plugins:[{
    name:'nonessential-animation-adapter', setup(build) {
      build.onResolve({filter:/^(framer-motion)$|FloralPetalsEngine/}, args=>({path:args.path,namespace:'test-animation'}));
      build.onLoad({filter:/.*/,namespace:'test-animation'},args=>({loader:'js',resolveDir:process.cwd(),contents:args.path==='framer-motion' ? `import React from 'react'; const cache={}; export const motion=new Proxy({}, {get(_,tag){return cache[tag] ||= React.forwardRef(({initial,animate,exit,transition,whileHover,whileTap,layout,...props},ref)=>React.createElement(tag,{...props,ref}));}}); export const AnimatePresence=({children})=>children;` : 'export const triggerFloralShower=()=>{};'}));
    }
  }]});
  Modal=(await import('./.generated/modal.mjs')).default;
  server=await createServer({mode:'test',envFile:false,logLevel:'silent',server:{host:'127.0.0.1',port:0,strictPort:false,watch:null}});
  await server.listen(); origin=`http://127.0.0.1:${server.httpServer.address().port}`;
  globalThis.fetch=async (url,options)=>{
    if (String(url).startsWith('https://script.google.com/')) return google.fetch(url,options);
    if (String(url).startsWith('https://database.example.invalid/')) return databaseDown ? Response.json({}, {status:503}) : databaseFetch(url,options);
    if (String(url).startsWith('/api/')) {
      if (pendingMode) return Response.json({ success:true,status:'pending',data:{...JSON.parse(options.body),sheets_sync_status:'pending'},sync:{supabase:true,googleSheets:false} },{status:202});
      return nativeFetch(origin+url,options);
    }
    throw Error('Unexpected external request in local form test');
  };
});
afterEach(()=>cleanup());
after(async()=>{globalThis.fetch=nativeFetch;await server?.close(); dom?.window.close();});

function start(phone) {
  google=scriptAdapter();
  databaseFetch=databaseAdapter(google);
  pendingMode=false;
  render(React.createElement(Modal,{isOpen:true,onClose:()=>{}}));
  fireEvent.change(screen.getByPlaceholderText('e.g. Dr. Rajesh Sharma & Family'),{target:{value:'LOCAL FORM TEST'}});
  fireEvent.change(screen.getByPlaceholderText('10-digit mobile number'),{target:{value:phone}});
  fireEvent.click(screen.getByRole('button',{name:/Continue/}));
}

test('real attending form → local HTTP API → signed Apps Script → independent row read',async()=>{
  start('9000000011');
  assert.ok(screen.getByRole('button',{name:/Back/}));
  fireEvent.click(screen.getByRole('button',{name:/Back/}));
  assert.equal(screen.getByPlaceholderText('10-digit mobile number').value,'9000000011');
  fireEvent.click(screen.getByRole('button',{name:/Continue/}));
  fireEvent.click(screen.getByRole('button',{name:/Continue/}));
  fireEvent.click(screen.getByRole('button',{name:/14 February 2027/}));
  fireEvent.click(screen.getByRole('button',{name:'13 Feb (Pre-wedding)'}));
  assert.ok(screen.getByRole('button',{name:/10:30 AM/}));
  fireEvent.change(screen.getByPlaceholderText('Write your blessings and wishes here...'),{target:{value:'All our blessings — local only.'}});
  fireEvent.click(screen.getByRole('button',{name:'Submit RSVP'}));
  await waitFor(()=>assert.ok(screen.getByText('RSVP saved and verified in the wedding spreadsheet.')),{timeout:10000});
  assert.equal(google.rows.length,2); assert.equal(google.rows[1][9],'13 February 2027'); assert.equal(google.rows[1][10],'10:30 AM');
  assert.equal(google.rows[1][11],'All our blessings — local only.'); assert.equal(google.rows[1][8].split('; ').length,4);
  assert.equal(google.rows[1][16],'Car');
  assert.ok(screen.getByRole('button',{name:'Close RSVP form'}));
});

test('form distinguishes durable pending acceptance from verified Sheets success',async()=>{
  start('9000000014'); pendingMode=true;
  fireEvent.click(screen.getByRole('button',{name:/Continue/}));
  fireEvent.click(screen.getByRole('button',{name:'Submit RSVP'}));
  await waitFor(()=>assert.ok(screen.getByText('RSVP saved. Spreadsheet synchronization is pending.')));
  assert.equal(screen.queryByText('RSVP saved and verified in the wedding spreadsheet.'),null);
  assert.equal(google.writes,0);
});

test('real declining form persists zero guests and its optional blessing',async()=>{
  start('9000000012');
  fireEvent.click(screen.getByRole('button',{name:'Regretfully Declining'}));
  fireEvent.click(screen.getByRole('button',{name:/Continue/}));
  fireEvent.change(screen.getByPlaceholderText('Write your warm wishes and blessings for the couple...'),{target:{value:'Warm wishes from afar.'}});
  fireEvent.click(screen.getByRole('button',{name:'Submit RSVP'}));
  await waitFor(()=>assert.ok(screen.getByText('Response Received')),{timeout:10000});
  assert.equal(google.rows[1][7],'0'); assert.equal(google.rows[1][8],''); assert.equal(google.rows[1][10],'');
  assert.equal(google.rows[1][11],'Warm wishes from afar.');
});

test('failed persistence keeps form open and preserves inputs for retry',async()=>{
  start('9000000013');
  fireEvent.click(screen.getByRole('button',{name:/Continue/}));
  const message=screen.getByPlaceholderText('Write your blessings and wishes here...');
  fireEvent.change(message,{target:{value:'Do not lose this blessing.'}});
  databaseDown=true;
  fireEvent.click(screen.getByRole('button',{name:'Submit RSVP'}));
  await waitFor(()=>assert.ok(screen.getByText(/We could not confirm your RSVP was saved/)),{timeout:10000});
  assert.equal(message.value,'Do not lose this blessing.'); assert.equal(google.rows.length,1);
  databaseDown=false;
  fireEvent.click(screen.getByRole('button',{name:'Submit RSVP'}));
  await waitFor(()=>assert.ok(screen.getByText('RSVP saved and verified in the wedding spreadsheet.')),{timeout:10000});
  assert.equal(google.rows.length,2);
});

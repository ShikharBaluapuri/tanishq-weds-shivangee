# Production RSVP verification — 28 October 2026

Status: WORKING AND VERIFIED for the approved attending RSVP. The live form originally saved it to Supabase; the repaired production API now verifies its Google Sheets row. This report records real API results, not just local adapters.

## Root causes

1. The existing Vercel project had zero environment variables. Local credentials were not available to deployed functions.
2. The configured Apps Script URL still served Version 1 even after repaired source was saved. Its legacy handler interpreted diagnostic envelopes as new, unnamed RSVP rows. Generic success plus matching spreadsheet metadata was insufficient proof of a working protocol.
3. The Apps Script signing property differed from the server secret. The existing property was corrected privately.
4. Unicode-bearing signed messages failed authentication even though simple health messages passed. Server serialization now escapes Unicode in the signed JSON message; Apps Script JSON parsing restores the exact guest text. A real read-only Hindi/em-dash/emoji request passed, and the em-dash-bearing test RSVP subsequently passed write/read verification.

## Deployed connection

- Website: https://tanishqwedsshivangee.vercel.app
- Vercel project: `prj_7xzg4oOuVMEYtDBCW0DUyO2Q2QZN`, team `code-z6`.
- Current repaired deployment: `dpl_935bfisb6gNGaRYkFDyRsSWkkpGS`, READY, promoted to production.
- Deployment URL: https://tanishqwedsshivangee-4smy73vn3-code-z6.vercel.app
- Supabase project: `ShikharBaluapuri's Project`, ref `nrhzgqpegymnqjrmsiub`.
- Authoritative table: `public.wedding_rsvps`; durable queue: `public.wedding_rsvp_outbox`.
- Spreadsheet: `1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y`, tab `Sheet1`.
- Apps Script project: `1oPCAnALqCt72D5G7ZGdKe5jMK7ONCA8XbcEsCpKTo7ebQtkGSo4CMuEs`.
- Existing named deployment: `T&S Wedding RSVP Webhook`, upgraded from Version 1 to Version 3 on 28 October 2026 at 20:10 IST.
- Existing /exec deployment ID: `AKfycbzQMeoi9tN9Dvils02qxQEyPfbeG03U2ZybvdvH6VArhrMGhpZPaFvlkrIt24_YCGOBcQ`.
- Protocol: `wedding-rsvp-v2`. GET checks version before POST; signed replies must echo the action and unique request nonce.

## Real test evidence

The host explicitly approved one production test RSVP and later authorized retries of this same record.

- Name: `TEST RSVP — DELETE AFTER VERIFICATION`.
- RSVP ID: `RSVP-0c34038f-f8a5-458a-a272-7e34f1ad5dfc`.
- Test-only number: `910000000000`; no WhatsApp message sent.
- Origin: the actual deployed browser form.
- Attendance: Joyfully Attending; count: 2; side: Friends & Colleagues.
- Events: all four selected functions.
- Arrival: 13 February 2027, 06:00 PM IST, Car.
- Blessing: `Controlled production integration test. Delete after verification.`
- Consent: false / Not Opted In.
- Original submission timestamp preserved: 28 October 2026, 7:50:28 pm IST.
- Independently located through the connected Google Sheets API: **Sheet1!A17:Q17**.
- All 17 fields compared against the persisted Supabase payload and matched exactly.
- Two final live `/api/rsvp` retries returned HTTP 200, `sync.supabase=true`, `sync.googleSheets=true`, and the original RSVP ID.
- After each retry: one matching Supabase row, one matching spreadsheet row, status synced; no duplicate test row.
- Vercel production logs: POST `/api/rsvp`, event `rsvp_saved`, `sheets=verified`, `durable=true` on deployment `dpl_935bfisb6gNGaRYkFDyRsSWkkpGS`.
- Machine-readable local evidence: `tests/.generated/production-verification.json` (ignored from Git/deployment).

## Reliability and security

- Supabase persistence is mandatory before success. Sheets failure returns saved/pending after durable database acceptance.
- Duplicate IDs and phone conflicts are checked in PostgreSQL. Guest retries preserve the first accepted payload and timestamps.
- The queue uses database leases, stale-completion protection, exponential backoff, and persisted failure status.
- Host updates require an authenticated host session and expected revision; updates requeue the same RSVP ID.
- Server-only credentials are not exposed through VITE variables.
- Guest tables and request-limit table have RLS enabled; anon/authenticated roles cannot read them. The security advisor's INFO “RLS enabled no policy” is intentional for this server-only access model.
- Host login and RSVP submissions use persistent HMAC-keyed request throttling.
- The host dashboard reads Supabase records only. Public pages do not query private guest records.
- Sheets writes use RAW values, preserving guest-entered strings as data.
- Required Production secrets are configured and were validated through the deployed host health endpoint: SUPABASE_URL, SUPABASE_SECRET_KEY, GOOGLE_SHEETS_WEBHOOK_URL, GOOGLE_SHEETS_WEBHOOK_SECRET, SESSION_SECRET, HOST_DASHBOARD_PIN, RATE_LIMIT_SECRET, SYNC_WORKER_SECRET.
- The scoped worker token is stored in Supabase Vault. The every-minute job `wedding-rsvp-sheet-sync` was re-enabled only after final production verification. See final scheduler evidence below when available.

## Checks

## Changed components

- `google-apps-script/Code.gs`: signed actions, locking, exact destination, RAW upserts and read-back; deployed as Version 3.
- `server/sheets.js`: pre-POST protocol handshake, nonce/action verification, Unicode-safe signing and field-by-field verification.
- `server/store.js`, `server/sync-worker.js`, `server/request-controls.js`: official Supabase client, authoritative persistence, leased retries, persistent throttling.
- `api/rsvp.js`, `api/sync-rsvps.js`, `api/retry-sync.js`: durable acceptance, protected worker, retries.
- `api/admin-rsvps.js`, `api/admin-update-rsvp.js`, `api/verify-pin.js`, `api/test-sheets.js`: protected real dashboard, revision-controlled updates, host authentication and actual authorized health checks.
- `supabase/migrations/`: primary table, outbox, request limits, update/acknowledgement RPCs, Vault-backed scheduler.
- `src/services/rsvpClient.js`, `src/services/rsvpService.js`, `src/components/RsvpModal.jsx`, `src/components/AdminDashboardModal.jsx`: stable submission IDs, accurate feedback, private data access and host passphrase support. Wedding design and event content were preserved.
- `vite.config.js`, `vercel.json`, `.vercelignore`, test/configuration scripts: local API verification and deployment packaging.

## Test results

- 27 local tests passed, including attending/declining forms, failure feedback, database durability, SQL RLS/idempotency, leases/backoff/stale completions, legacy-protocol rejection before POST, and Unicode signing.
- ESLint, TypeScript checking, production build, and whitespace checks passed.
- A preview without production credentials passed page/authentication/validation checks.
- The final staged production deployment passed host authentication, database dashboard, signed Sheets health, guest-record protection, and worker authentication checks before promotion.
- Actual scheduled HTTP response at 20:22:00 IST on 28 October 2026: HTTP 200, success=true, processedCount=0. This confirms scheduler-to-Vercel authentication and invocation; the queue was empty because the approved test record was already synced.

## Cleanup and operational limits

- The approved test row remains at row 17, with its corresponding Supabase record. Deletion requires separate host approval. No guest response has been deleted.
- The legacy endpoint created unnamed rows during earlier diagnostics before the deployment mismatch was discovered. They remain untouched and must be reviewed separately; do not delete by row range without identifying exact records first.
- Existing historical spreadsheet rows were preserved, not automatically imported as genuine Supabase guests. Some older rows are labeled samples/tests and need host review before migration.
- Release used the reviewed local checkout via Vercel CLI. Changes are still uncommitted locally. The local Git remote/branch and Vercel's saved Git link differ; reconcile them before a future Git-triggered release so old code cannot replace this repair.
- The host passphrase is the private HOST_DASHBOARD_PIN value in .env.local; it is also configured as a Vercel Production secret. No secret values are included in this report.

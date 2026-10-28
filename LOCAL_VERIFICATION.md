# Local verification — 28 October 2026

Latest pass: 26 tests passed; type checking and production build passed. Supabase runtime API returned HTTP 200 for a count-only read of wedding_rsvps (zero rows). The primary schema and queue were applied to project nrhzgqpegymnqjrmsiub. Both tables have RLS enabled and no anon/authenticated read grants. Apps Script verifySetup reported authorized spreadsheet and Sheet1 access verified. No production test row, scheduled worker, or repaired Vercel deployment has been verified.

The notes below describe the earlier baseline, before the mandatory primary-store migration.

Status: PARTIALLY CONFIGURED. These are local checks, not production verification.

- TypeScript: `npm run typecheck` passed. This checks the typed source and parses included JS/JSX; `checkJs` is disabled for the existing JavaScript codebase.
- Tests: `node --test --test-concurrency=1 tests/*.test.js` — 22 passed, 0 failed.
- Build: `npm run build` passed (Vite 6.4.5).
- Patch whitespace: `git diff --check` passed.
- CLI recovery: fresh-cache `vercel@latest --version` returned 65.4.0. The runbook pins that verified version.

## Test coverage and limits

The actual React RSVP modal was rendered in a local DOM environment. Its form handlers submitted to the actual local Vite HTTP API. The API signed requests to the actual Code.gs evaluated against in-memory Google API adapters. Nonessential animations were stubbed in these functional tests. This is not a visual browser/device test or an authenticated Google integration test.

Covered: attending and declining form flows; separate date/time; arrival transport; blessing retention; Back/Continue/Submit/Close presence; failure feedback and retry; pending feedback; all mapped cell values; RAW formula-like strings; stable retry IDs; duplicate submit coalescing; phone collisions; header mismatch; duplicate existing IDs; lost response after commit; authentication failure; wrong sheet ID; HTML login pages; read-back mismatch; unauthenticated diagnostics; durable storage failure; private session validation; and retrying an accepted outbox item without duplicate rows.

The exact Supabase SQL migration was executed twice in an in-memory PostgreSQL engine (PGlite). It verified idempotent installation, one accepted row across repeated calls, preserved original payload and timestamps, conflicting-payload/phone rejection, and denied access for anon/authenticated roles. This does not verify the user's actual Supabase/PostgREST configuration, deployed policies, or legacy data.

## Production evidence still required

- Restored Vercel account/project access; production/preview environment scopes and credentials.
- Existing Apps Script owner authorization, advanced Sheets API setup, signed endpoint, and header Q1.
- Preview and production deployment IDs, READY status, actual hostname routing, and function logs.
- User-approved controlled production form submission, independent authenticated row read-back, exact values, and one-row count after retry.
- Separate user approval before deleting the exact test row.

No production test record was submitted or deleted. No new spreadsheet or Vercel project was created. The target sheet metadata and A1:P1 were authenticated-read in the previous turn; this local test run did not modify the spreadsheet. All production test/read-back fields remain unverified.

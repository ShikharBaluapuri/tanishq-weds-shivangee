# RSVP repair: access recovery, configuration, and verification

Status: local implementation and tests only. No repaired Vercel deployment or real Google row has been verified. Do not describe this as WORKING AND VERIFIED yet.

## Current state — 28 October 2026 (supersedes optional-database instructions below)

- Vercel CLI access recovered. Existing project: prj_7xzg4oOuVMEYtDBCW0DUyO2Q2QZN, team code-z6. Remote Git linkage differs from the local remote; resolve before Git-based deployment.
- Supabase is mandatory. Use SUPABASE_URL and SUPABASE_SECRET_KEY (legacy SERVICE_ROLE alternative supported). The primary schema and outbox are applied to nrhzgqpegymnqjrmsiub; both remain empty and private.
- The host dashboard reads wedding_rsvps only. Public wall queries no longer access private guest records.
- POST /api/sync-rsvps requires a server-only SYNC_WORKER_SECRET and claims a leased database job. A trusted external scheduler must call it; no scheduler is installed yet. Do not call automatic synchronization operational until scheduling is configured and verified.
- Apps Script source is saved, Sheets service enabled, Q1 Arrival Mode verified, and verifySetup succeeded. The repaired source still needs a versioned deployment and signed health check. Local signing secret was rotated; user reports matching Script Property updated. Verify with signed health after deploying.
- Preview needs isolated test resources. Do not copy production secrets into untrusted preview deployments.
- Remaining: persistent abuse/login rate limits, host credential setup, authenticated host updates, scheduler activation, linting, preview and production deployment, and approved real-row verification.
- Latest checks: 26 tests, type checking and Vite production build passed. Local tests use adapters/PGlite, not a real staging Sheets write.

## 1. Restore Vercel CLI access

The previous saved credential was rejected by Vercel with HTTP 403 and `invalidToken: true`. A separate npm cache problem caused `Invalid Version`. The fresh-cache command below was tested successfully and reported Vercel CLI **65.4.0**.

Open PowerShell yourself and run:

```powershell
Set-Location -LiteralPath 'E:\T&S'
function vcli { npx --cache "$env:TEMP\ts-vercel-cli-recovery" --yes vercel@65.4.0 @args }
vcli login
vcli whoami
vcli env ls production
```

Complete the sign-in in your browser using the Vercel account that owns this project. `whoami` must return your account, and `env ls production` must list the existing project's environment (an empty variable list is different from an authorization failure). If login refuses to replace the stale session, run `vcli logout`, then `vcli login` again. If the account is valid but the project is forbidden, select the owning team/account; don't create a new project.

The existing `.vercel/project.json` must continue to identify:

- Project name: `tanishqwedsshivangee`
- Project ID: `prj_7xzg4oOuVMEYtDBCW0DUyO2Q2QZN`
- Team ID: `team_tkqvOr8rvGmnPQZdSzoJUJoK`
- Existing production hostname recorded in the project: `https://tanishqwedsshivangee.vercel.app` (latest alias/status still requires verification).

Do not paste the CLI token, PIN, or any secret into chat. Tell the assistant whether `whoami` and `env ls production` succeeded. A browser-only Vercel login does not necessarily refresh the CLI login.

Official references: [Vercel login](https://vercel.com/docs/cli/login), [whoami](https://vercel.com/docs/cli/whoami), [environment commands](https://vercel.com/docs/cli/env).

## 2. Prepare the EXISTING Apps Script project

1. Open the official [RSVP spreadsheet](https://docs.google.com/spreadsheets/d/1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y/edit), then **Extensions → Apps Script**. If the existing webhook belongs to a standalone script, open that original project from the Apps Script dashboard instead. Do not create another spreadsheet or replace unrelated script files.
2. Preserve the currently deployed version. Replace the RSVP handler's `Code.gs` with the repository's `google-apps-script/Code.gs`; ensure there is only one `doPost`/`doGet` implementation. The production spreadsheet ID and `Sheet1` are hard-coded. No fallback destination is allowed.
3. In **Project Settings**, enable **Show appsscript.json manifest file in editor**. Merge the supplied `google-apps-script/appsscript.json` into the existing manifest, retaining unrelated settings/services if present. It enables the Sheets v4 advanced service, the spreadsheets scope, V8, and Asia/Kolkata.
4. Under **Services → +**, verify **Google Sheets API**, version **v4**, identifier **Sheets** is enabled. If this script uses a standard Google Cloud project, also enable the Google Sheets API in that Cloud project's API library. The default Apps Script Cloud project normally enables it when adding the advanced service.
5. In **Project Settings → Script Properties**, add `RSVP_WEBHOOK_SECRET`. Use a new random 64-character hex secret. This SAME value goes into Vercel's `GOOGLE_SHEETS_WEBHOOK_SECRET`. It does not belong in source code, a spreadsheet cell, or any `VITE_` variable.
6. The existing sheet has 16 headers in A1:P1. The form also has an arrival transport field; the repaired mapping preserves it in **Q1 = `Arrival Mode`**. Before appending that header, inspect Q to ensure it contains no existing data. Do not overwrite or reorder A:P, delete guest rows, or add a test RSVP. If Q is occupied, stop and resolve the mapping first. The repaired script deliberately reports `Header Mismatch` until all 17 headers match.
7. Select **verifySetup** in the function selector and click **Run**. Authorize the script with the Google identity that can edit this exact sheet. This checks Sheets API access and edit permission without writing an RSVP. A Workspace policy restriction or denied authorization must be resolved by the owner; don't bypass a browser security warning.

To generate a secret privately into your clipboard in PowerShell (run once for the webhook secret, again later for a separate session secret):

```powershell
node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('hex'))" | Set-Clipboard
```

Use the copied value in Script Properties and the matching Vercel variable. Keep the two different secrets in your password manager. Do not send them to the assistant.

### Publish the repaired endpoint without switching the live website yet

In this SAME Apps Script project, use **Deploy → New deployment → Web app** to create a separately versioned repaired endpoint. Set **Execute as: Me** (the sheet editor) and **Who has access: Anyone**. HTTP access must permit the Vercel server to reach it; every data operation is still authenticated by the HMAC signature and timestamp in the server request. The sheet itself stays private.

Copy its **Web app URL ending `/exec`** into Vercel. Do not use `/dev`, the script editor URL, or the spreadsheet URL. Opening `/exec` in a normal browser intentionally returns `Authentication Failed`; that is not the signed health check.

Leave the previous live deployment unchanged during preparation. After the new Vercel production path is verified, archive the old unauthenticated Apps Script deployment so it cannot continue accepting unsigned writes. Do not archive unrelated deployments.

Official references: [Web apps](https://developers.google.com/apps-script/guides/web), [advanced services](https://developers.google.com/apps-script/guides/services/advanced), [versioned deployments](https://developers.google.com/apps-script/concepts/deployments).

## 3. Set Vercel server variables

Open the EXISTING project → **Settings → Environment Variables**. Configure **Production** and **Preview**, and Development if you want local authenticated health checks:

| Name | Value |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Repaired Apps Script `/exec` URL |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Exactly the Script Property `RSVP_WEBHOOK_SECRET` |
| `SESSION_SECRET` | A different random 64-character hex secret |
| `HOST_DASHBOARD_PIN` | Your private host PIN; no built-in default remains |
| `SUPABASE_URL` | Existing Supabase project URL, only when using durable database mode |
| `SUPABASE_SERVICE_ROLE_KEY` | Existing Supabase server service-role key, only for database mode |

Never set private credentials under `VITE_` or `NEXT_PUBLIC_`. The former `VITE_GOOGLE_SHEETS_WEBHOOK_URL` and locally saved dashboard URL are no longer used for routing. Avoid duplicate legacy variables that imply a different destination.

If Supabase already exists, retain it as the durable primary store: apply `supabase/migrations/20261027_rsvp_outbox.sql` in that existing project's SQL editor and configure both server variables. The migration adds a private outbox and RPC; it does not delete or migrate legacy `wedding_rsvps`. Audit legacy records separately before any recovery/replay, because old local stores include sample entries. Do not automatically import them as real guests.

If Supabase genuinely is not in use, leave both server database variables unset. Sheets-only mode confirms success only after the target row is independently read back. Partial database configuration fails closed; do not remove a real database configuration simply to hide an error.

Environment changes apply to new deployments, so a fresh preview and production deployment are required. [Vercel environment documentation](https://vercel.com/docs/environment-variables).

## 4. Local check after configuration

Append the server variables to `.env.local` privately, preserving its existing contents. Never commit it. Then:

```powershell
Set-Location -LiteralPath 'E:\T&S'
npm run typecheck
npm test
npm run build
npm run sheets:health
```

`sheets:health` performs a signed, read-only check of the exact spreadsheet; it never creates a test entry. Only its returned status and spreadsheet identity should be shared. `Configuration Missing` means values are absent/invalid; `Authentication Failed` means the Google access mode or signing secret is wrong; `Header Mismatch` means the 17-column layout is not ready. `Spreadsheet Not Accessible` requires checking the executing user's access/protected ranges.

The test suite runs the real React form, local HTTP API, actual Apps Script source with isolated Google adapters, and in-memory PostgreSQL. It does not establish real Google permissions, Vercel function behavior, or a production row.

## 5. Deployment and final evidence gate

After authentication is restored, the assistant must inspect production variable names/scopes, the current deployment and function logs, then deploy to this existing project. CLI commands are `vcli` for a preview and `vcli --prod` for production. Do not promote until required checks pass and the preview diagnostic verifies authorized access. Record both deployment IDs and READY status; inspect logs for the actual request.

No second Google Sheet is created by this repair. Because the prepared endpoint targets the production sheet, even a preview form submission writes production data. Do not submit the preview form against it until the user approves the controlled production test. A separate existing test sheet would need an explicitly reviewed staging-only configuration; never swap production IDs casually.

Request approval for exactly one record labeled `TEST RSVP — DELETE AFTER VERIFICATION`, with non-personal values. Submit via the actual deployed form, record the request/response and RSVP ID, inspect Vercel logs, and use independent authenticated Google Sheets access to read the exact row from the production spreadsheet. Compare all 17 fields. Retry the identical payload/ID and verify the count remains one. A success status alone is insufficient.

After read-back, identify the exact row and ask separately before deleting it. Never delete a real guest. Only after the real target row is verified may the report say **WORKING AND VERIFIED**.

## Storage and retry semantics

- Immediate retries use the same RSVP ID, with a script-wide lock and duplicate-phone guard.
- A lost response can be retried without appending another row.
- Supabase mode persists the complete accepted payload before Sheets and returns `202 pending` if synchronization fails. The host's **Retry Next Pending** processes one saved record per request and confirms it by read-back. There is no unattended scheduled retry job in this patch.
- Supabase retries retain the first accepted payload. Conflicting changes to an accepted RSVP require host review rather than overwriting data. Sheets-only repeated writes update the same row while preserving submission timestamps; stale updates are rejected.
- Browser storage holds only retry identifiers before acceptance and is never treated as a durable save.
- Host diagnostics and guest lists require a server-verified session. Local demo blessings are not used as host RSVP evidence.
- This repair does not send automated WhatsApp messages; the existing manual share flow remains available. Spreadsheet retry cannot trigger message dispatch.

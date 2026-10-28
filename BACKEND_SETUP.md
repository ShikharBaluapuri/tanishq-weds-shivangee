# Backend setup

Use [RSVP_DEPLOYMENT_RUNBOOK.md](RSVP_DEPLOYMENT_RUNBOOK.md) for the current setup and verification procedure.

The previous instructions were unsafe: they created a different spreadsheet, used an unsigned webhook, and treated localStorage as successful RSVP storage. Do not use that old setup.

The sole production destination is spreadsheet `1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y`, worksheet `Sheet1`. The repaired code preserves A:P and requires `Arrival Mode` in Q1 to save the transport field. The live sheet has not been modified by this local repair.

Required server configuration and the optional private Supabase migration are documented in the runbook. A real production row and deployment still need verification before declaring the integration operational.

# Asset And Audio Pipeline Goal

Status: active

## Purpose

Keep the legacy asset/audio requirement separate from the playable scaffolding so placeholder progress is not mistaken for final parity.

## Required Pipeline

- Source identity proof for both old Unity Gold Rush projects.
- Raw copy into this repo through guarded import branches.
- Deny-path scan.
- Secret scan.
- Copy ledger.
- Hash manifest.
- Classification receipt.
- Sanitized conversion output.
- Human review packet.
- License provenance packet.
- Approval decision packet.
- Approved runtime promotion into `public/assets`.
- Runtime registry update with safe `assets/...` paths only.

## Current Rule

Raw and sanitized files are not runtime assets. The game may use procedural fallbacks and placeholder slots until approved runtime records exist.

## Audio Requirement

- Use actual Gold Rush legacy audio only after approval and runtime promotion.
- Until then, use semantic cue-state and short procedural fallbacks.
- Avoid sustained humming beds on title/lobby.
- Preserve cue slots for title, train arrival, train door, boarding, departure, mining pickup, revolver, ambush, cashout, combat, and results.

## Completion Evidence

- Asset registry shows promoted approved records.
- Public build contains only approved runtime assets.
- Browser proof demonstrates promoted audio/visual slots rendering or playing through the approved registry.

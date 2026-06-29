# Gold Rush Receipt Ledger Contract

## Purpose

Receipt ledgers make extraction, room handoff, scoring, and replay repeat-safe. Commands that arrive twice are recorded as duplicates and cannot double-apply gameplay outcomes.

## Runtime APIs

- `engine.n.goldrushExtractionReceipts`
- `engine.n.goldrushRoomHandoffReceipts`
- `engine.n.goldrushReplaySummary`

## Extraction Receipts

Accepted extraction receipts include:

- stable `receiptId`
- `playerId` and `teamId`
- `goldAmount`
- `cargoValue`
- `cashoutId`
- `goldZoneId`
- `roomWindowId`
- deterministic `tick`
- final rush pressure multiplier
- score value

Duplicate extraction receipts are tracked as `status: "duplicate"` and do not affect totals or scoring.

## Room Handoff Receipts

Accepted handoff receipts include:

- stable `handoffId`
- `gateId`
- source and destination room window IDs
- trigger path ID
- transition ID
- player IDs
- deterministic `tick`

Handoffs with missing gates or identical source/destination windows are rejected.

## Replay Summary

Replay summaries are compact deterministic snapshots built from match state, extraction receipts, handoff receipts, scoring, combat receipts, and final result state.


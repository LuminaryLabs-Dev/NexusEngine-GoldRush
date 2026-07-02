# Cashout Extraction Sites - Contract

Status: planned docs-only
Slice: 16 Cashout Extraction Sites
Domain: gameplay/world/match
Scene/site: site.gold-field
Generic kit: n:gameplay:extraction
GoldRush kit: n:goldrush:cashout-sites

## Purpose

Define the owner kit, domain boundary, public API, private API, snapshot, reset, and graduation boundary.

## Slice Intention

Make extraction a visible, contested, timed, interruptible site interaction tied to world landmarks.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:cashout-sites` and not by renderer-only logic.
2. Confirm the generic kit dependency remains neutral and promotable when applicable.
3. Define the smallest public API command or query the next slice needs.
4. Define the private work the kit may do behind the API.
5. Define the event payload emitted when the slice changes.
6. Define the serializable snapshot for browser and simulator proof.
7. Define reset behavior for scene changes, match restart, and failed proof.
8. Define the main negative fixture or fakeout case.
9. Define one human-view acceptance check when the slice is player-facing.
10. Define the next slice that consumes this output.

## Event And Snapshot

- Event: `extraction.hold.completed`
- Snapshot: `cashoutExtractionSites`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`proof:extraction-setpiece plus validate-goldrush-extraction-loop`

## Human-View Proof Seed

player reaches cashout set piece, sees prompt/progress/risk, completes or is interrupted, and emits receipt

## Known Fakeout

Cashout completes from any location or through a direct state call with no route, site, or timer.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


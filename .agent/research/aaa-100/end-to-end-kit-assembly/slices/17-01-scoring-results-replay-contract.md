# Scoring Results Replay - Contract

Status: planned docs-only
Slice: 17 Scoring Results Replay
Domain: match/presentation
Scene/site: site.results
Generic kit: n:match:receipts plus n:match:scoring plus n:match:results
GoldRush kit: n:goldrush:extraction-receipts plus n:goldrush:gold-rush-scoring plus n:goldrush:results-screen

## Purpose

Define the owner kit, domain boundary, public API, private API, snapshot, reset, and graduation boundary.

## Slice Intention

Convert mined, carried, contested, extracted, lost, and combat receipts into readable end-of-match payoff.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:extraction-receipts plus n:goldrush:gold-rush-scoring plus n:goldrush:results-screen` and not by renderer-only logic.
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

- Event: `match.results.finalized`
- Snapshot: `scoringResultsReplay`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`results-screen proof plus validate-match-results`

## Human-View Proof Seed

results screen shows score, extraction, pressure, contest, replay moments, and next actions without raw ids visible

## Known Fakeout

Results displays fixed copy or narrow proof values instead of receipt-backed match facts.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


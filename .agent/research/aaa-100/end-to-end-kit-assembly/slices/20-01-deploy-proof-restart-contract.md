# Deploy Proof Restart - Contract

Status: planned docs-only
Slice: 20 Deploy Proof Restart
Domain: release/proof/versioning
Scene/site: public-build
Generic kit: n:runtime:validation plus n:runtime:snapshot
GoldRush kit: n:goldrush:reality-status

## Purpose

Define the owner kit, domain boundary, public API, private API, snapshot, reset, and graduation boundary.

## Slice Intention

Keep every major loop change tied to local proof, public proof, sanitized reports, changelog, and restart packet.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:reality-status` and not by renderer-only logic.
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

- Event: `release.proof.published`
- Snapshot: `deployProofRestart`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`proof:live-state-audit plus validate-report-secrets`

## Human-View Proof Seed

local and public reports cover the changed slice and name the proof gap if the full end state remains incomplete

## Known Fakeout

A branch builds or a local proof passes but the public player-view state is stale or narrower.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


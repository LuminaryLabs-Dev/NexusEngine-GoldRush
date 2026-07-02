# Mining Hold Action - Contract

Status: planned docs-only
Slice: 12 Mining Hold Action
Domain: gameplay/animation/audio
Scene/site: site.gold-field
Generic kit: n:gameplay:interaction-hold
GoldRush kit: n:goldrush:mine-hold-action

## Purpose

Define the owner kit, domain boundary, public API, private API, snapshot, reset, and graduation boundary.

## Slice Intention

Make mining a tactile hold action with cancel, progress, animation, audio, receipt, and cargo output.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:mine-hold-action` and not by renderer-only logic.
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

- Event: `mining.hold.completed`
- Snapshot: `miningHoldAction`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`validate-player-driven-extraction-route`

## Human-View Proof Seed

player approaches resource, starts hold, sees progress, can complete, and receives carried gold state

## Known Fakeout

A script adds gold directly without an in-world object, hold time, or visible result.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


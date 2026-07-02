# Group Selection Match Config - Proof

Status: planned docs-only
Slice: 05 Group Selection Match Config
Domain: UX/match/config
Scene/site: site.lobby-character
Generic kit: n:match:lifecycle
GoldRush kit: n:goldrush:party-lobby

## Purpose

Define CLI, simulator, Playwright, human-view, and public proof gates that would make this slice believable.

## Slice Intention

Keep Crew, Posse, and Outfit as compact configuration instead of first-screen card clutter.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:party-lobby` and not by renderer-only logic.
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

- Event: `match.config.changed`
- Snapshot: `groupSelectionMatchConfig`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`validate-match-lifecycle`

## Human-View Proof Seed

selected group size affects match seed and allowed squad/match settings without taking over the main UX

## Known Fakeout

The UI lets players choose a label but the runtime match config ignores it.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


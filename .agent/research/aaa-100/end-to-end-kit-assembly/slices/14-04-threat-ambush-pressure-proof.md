# Threat Ambush Pressure - Proof

Status: planned docs-only
Slice: 14 Threat Ambush Pressure
Domain: combat/gameplay/audio
Scene/site: site.gold-field
Generic kit: n:gameplay:combat-pressure
GoldRush kit: n:goldrush:ambush-pressure

## Purpose

Define CLI, simulator, Playwright, human-view, and public proof gates that would make this slice believable.

## Slice Intention

Make extracting gold create escalating danger that the player can read and respond to.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:ambush-pressure` and not by renderer-only logic.
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

- Event: `threat.pressure.changed`
- Snapshot: `threatAmbushPressure`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`validate-goldrush-extraction-loop plus combat-readiness proof`

## Human-View Proof Seed

threat telegraph changes after cargo and presents readable pressure before damage or interruption

## Known Fakeout

Combat pressure exists as a hidden value but no player-facing warning, route, cover, or choice changes.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


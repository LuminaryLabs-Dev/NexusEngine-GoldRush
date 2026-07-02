# Gold Field Spawn Map Source - Contract

Status: planned docs-only
Slice: 08 Gold Field Spawn Map Source
Domain: world/scene
Scene/site: site.gold-field
Generic kit: n:world:terrain-heightfield
GoldRush kit: n:goldrush:desert-world-map

## Purpose

Define the owner kit, domain boundary, public API, private API, snapshot, reset, and graduation boundary.

## Slice Intention

Spawn the player into an authored desert source that owns height, masks, routes, landmarks, and gameplay zones.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:desert-world-map` and not by renderer-only logic.
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

- Event: `world.map.revision.loaded`
- Snapshot: `goldFieldSpawnMapSource`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`validate-terrain-heightfield plus authored fixture validator`

## Human-View Proof Seed

spawn position, terrain revision, walkable mask, and site intent are visible in state and browser proof

## Known Fakeout

A player appears in a desert scene but the map source cannot explain why that spawn is valid.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


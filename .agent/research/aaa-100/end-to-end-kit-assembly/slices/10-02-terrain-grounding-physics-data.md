# Terrain Grounding Physics - Data

Status: planned docs-only
Slice: 10 Terrain Grounding Physics
Domain: world/physics
Scene/site: site.gold-field
Generic kit: n:physics:world plus n:physics:query
GoldRush kit: n:goldrush:terrain-physics plus n:goldrush:player-grounding

## Purpose

Define the minimal serializable data and event payloads needed for the slice to compose with adjacent kits.

## Slice Intention

Keep player, props, colliders, raycasts, and visible terrain in one parity contract.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:terrain-physics plus n:goldrush:player-grounding` and not by renderer-only logic.
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

- Event: `physics.grounding.sampled`
- Snapshot: `terrainGroundingPhysics`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`validate-physics-colliders plus validate-terrain-continuity`

## Human-View Proof Seed

ground mismatch remains within budget across motion samples and visible mesh agrees with collider samples

## Known Fakeout

The player appears grounded from one camera angle but actual heightfield and collider disagree.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


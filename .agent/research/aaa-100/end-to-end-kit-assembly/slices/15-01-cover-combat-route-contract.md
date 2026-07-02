# Cover Combat Route - Contract

Status: planned docs-only
Slice: 15 Cover Combat Route
Domain: combat/world/control
Scene/site: site.gold-field
Generic kit: n:physics:query plus n:control:third-person-camera
GoldRush kit: n:goldrush:combat-route-guidance plus n:goldrush:cover-protokits

## Purpose

Define the owner kit, domain boundary, public API, private API, snapshot, reset, and graduation boundary.

## Slice Intention

Give the player a natural route to cover and counterplay when an ambush starts.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:combat-route-guidance plus n:goldrush:cover-protokits` and not by renderer-only logic.
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

- Event: `combat.route.target.changed`
- Snapshot: `coverCombatRoute`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`proof:combat-route-guidance`

## Human-View Proof Seed

player carries cargo, pressure starts, cover route appears, movement reaches cover, and combat receipt records engagement

## Known Fakeout

A proof directly activates combat or cover without walking through a readable encounter path.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


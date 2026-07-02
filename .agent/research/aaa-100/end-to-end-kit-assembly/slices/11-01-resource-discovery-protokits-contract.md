# Resource Discovery Protokits - Contract

Status: planned docs-only
Slice: 11 Resource Discovery Protokits
Domain: world/gameplay/content
Scene/site: site.gold-field
Generic kit: n:render:micro-object-instancing plus n:world:placement-raycast
GoldRush kit: n:goldrush:desert-prop-kits plus n:goldrush:gold-seam-protokits

## Purpose

Define the owner kit, domain boundary, public API, private API, snapshot, reset, and graduation boundary.

## Slice Intention

Turn gold nodes, seams, rocks, plants, mine props, and signs into placed object protokits instead of anonymous meshes.

## Atomic Substeps

1. Confirm this slice is owned by `n:goldrush:desert-prop-kits plus n:goldrush:gold-seam-protokits` and not by renderer-only logic.
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

- Event: `resource.affordance.discovered`
- Snapshot: `resourceDiscoveryProtokits`
- Reset rule: clear transient scene state, retain durable receipts only when the match lifecycle owns them.

## Validator Seed

`validate-render-instancing plus object-protokit validator`

## Human-View Proof Seed

mineable resource is visually distinct, terrain-grounded, selectable, and tied to one affordance id

## Known Fakeout

A gold marker is visible but not tied to an object descriptor, terrain placement, or interaction affordance.

## Implementation Boundary

This is docs-only. Runtime code changes, new local kits, asset movement, deployment, and proof execution are deferred until implementation mode resumes.


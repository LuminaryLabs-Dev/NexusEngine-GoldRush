# Source Artboard Fixture Preflight 001

Status: active docs-only
Date: 2026-07-01
Domain: world / terrain source / render / physics / gameplay / validation
Source fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Define the first tiny source-artboard fixture that future terrain code must load before it changes the live map. This packet keeps implementation paused while turning the plateau diagnosis into a concrete data gate.

## Why This Exists

GoldRush is plateauing because the current terrain is still doing too many jobs from procedural code. The next pass needs one small authored source fixture that renderer, collider, placement, gameplay, LOD, and proof systems all consume.

## Fixture Shape

```txt
goldrush.desert.artboard.fixture.001
|-- revision and bounds
|-- height, normal, slope, material, biome, walkable, and blocker samples
|-- route, gold, mine, cover, extraction, rail, and pressure annotations
|-- terrain-grounded asset anchors
|-- near, mid, far, and horizon LOD cells
|-- query contract
|-- consumer readiness contract
|-- validators
`-- human and public proof gates
```

## Rules

- This packet is not runtime implementation.
- Do not create source code from this packet until implementation is allowed.
- Do not replace live terrain until this fixture has a validator and one visible consumer proof.
- Do not let any consumer infer terrain facts locally if the fixture already owns them.
- Do not mark the map plateau resolved from density alone; source parity and player readability are required.

## Files

- `fixture-preflight-matrix.md`
- `001-fixture-intent.md`
- `002-minimum-source-fields.md`
- `003-layer-sample-table.md`
- `004-query-contract.md`
- `005-consumer-readiness.md`
- `006-validator-plan.md`
- `007-human-view-proof-plan.md`
- `008-public-proof-and-restart.md`
- `009-implementation-simulation.md`
- `010-hardening-audit.md`
- `011-reference-notes.md`
- `atomic-matrix.md`
- `research-matrix.md`
- `simulation-matrix.md`
- `audit-matrix.md`
- `atomic/`
- `research/`
- `simulations/`
- `audits/`
- `micro-001-source-id-and-revision/`
- `micro-002-bounds-scale-and-origin/`
- `micro-003-height-sample-contract/`
- `micro-004-normal-and-slope-contract/`
- `micro-005-material-and-biome-mask-contract/`
- `micro-006-walkable-blocker-mask-contract/`
- `micro-007-route-annotation-contract/`
- `micro-008-mine-and-gold-annotation-contract/`
- `micro-009-cover-and-pressure-annotation-contract/`
- `micro-010-cashout-and-extraction-annotation-contract/`
- `micro-011-rail-and-train-reference-contract/`

## Atomic Layer

The atomic layer breaks `goldrush.desert.artboard.fixture.001` into 24 implementation-sized concerns. Each concern has:

- one atomic implementation packet
- one current-source research packet
- one implementation simulation
- one hardening audit

Future terrain implementation should pick one atom, read all four matching files, and prove one consumer before expanding the source fixture.

## Micro Runway

`micro-001-source-id-and-revision/` breaks atom 001 into 12 smaller identity and revision concerns. Future implementation should start there before writing source-fixture code so fixture id, revision id, consumer echo, stale-proof flags, and restart linkage are proven before renderer, collider, placement, or gameplay consumers expand.

`micro-002-bounds-scale-and-origin/` breaks atom 002 into 12 smaller bounds, scale, origin, cell-size, vertical-range, query-boundary, traversal-budget, LOD, partition, physics/render parity, and restart-policy concerns. Future implementation should prove this packet before mesh, collider, placement, LOD, gameplay, or room-scale consumers expand.

`micro-003-height-sample-contract/` breaks atom 003 into 12 smaller height array, value-domain, normalization, offset, cell-address, interpolation, edge-policy, query-API, proof-point, consumer-parity, negative-case, and stale-proof concerns. Future implementation should prove this packet before renderer, collider, raycast, movement, placement, or gameplay consumers treat terrain height as real.

`micro-004-normal-and-slope-contract/` breaks atom 004 into 12 smaller normal vector, normal space, slope domain, slope class, walkable threshold, derivation source, gradient neighborhood, sampleGround API, movement parity, placement parity, negative-case, and stale-proof concerns. Future implementation should prove this packet before player grounding, object alignment, route readability, or terrain-footing proof expands.

`micro-005-material-and-biome-mask-contract/` breaks atom 005 into 12 smaller material mask, biome mask, tag taxonomy, weight, blend policy, render parity, audio/VFX parity, placement filter, gameplay surface, negative-case, and stale-proof concerns. Future implementation should prove this packet before terrain visuals, cues, VFX, object placement, or gameplay zones claim authored surface identity.

`micro-006-walkable-blocker-mask-contract/` breaks atom 006 into 12 smaller walkable mask, blocker mask, walkability class, blocker class, slope linkage, hole/overhang policy, movement rejection, placement rejection, AI staging, edge transition, negative-case, and stale-proof concerns. Future implementation should prove this packet before movement, placement, bot staging, collider, camera, or public proof consumers claim terrain navigation correctness.

`micro-007-route-annotation-contract/` breaks atom 007 into 12 smaller primary route, alternate route, branch/return lane, route node, corridor budget, route risk tag, getZoneAt, proof point, player guidance, AI staging, negative-case, and stale-proof concerns. Future implementation should prove this packet before player guidance, bot routes, extraction paths, combat pressure, or public proof consumers claim authored traversal correctness.

`micro-008-mine-and-gold-annotation-contract/` breaks atom 008 into 12 smaller mine site, gold seam, resource node id, yield tier, workspace, readability tag, interaction anchor, placement echo, hold-action echo, cargo/receipt echo, negative-case, and stale-proof concerns. Future implementation should prove this packet before mining markers, gold visuals, hold actions, cargo, scoring, replay, bot behavior, or public proof consumers claim authored resource gameplay.

`micro-009-cover-and-pressure-annotation-contract/` breaks atom 009 into 12 smaller cover pocket, threat lane, pressure seed, sightline/occlusion tag, route linkage, counterplay, combat proof point, pressure query, renderer echo, combat-loop echo, negative-case, and stale-proof concerns. Future implementation should prove this packet before combat pressure, threat telegraphs, cover guidance, combat receipts, replay, bot behavior, or public proof consumers claim authored combat readability.

`micro-010-cashout-and-extraction-annotation-contract/` breaks atom 010 into 12 smaller cashout site, extraction radius, deposit anchor, return route, risk/contest tag, readability tag, cashout query, renderer marker echo, extraction hold echo, receipt/results echo, negative-case, and stale-proof concerns. Future implementation should prove this packet before cashout markers, extraction holds, receipts, scoring, replay, bot behavior, or public proof consumers claim authored extraction destinations.

`micro-011-rail-and-train-reference-contract/` breaks atom 011 into 12 smaller rail spline, train stop/platform anchor, loading-yard map edge, train path query, door/boarding side, motion state, rail/terrain parity, rail prop placement, camera handoff, train audio cue, negative-case, and stale-proof concerns. Future implementation should prove this packet before train arrival, boarding, departure, rail meshes, camera follow, audio cues, scene handoff, simulator proof, or public proof consumers claim authored train correctness.

## Owning Kits

| Domain | Generic kit candidate | GoldRush kit candidate | Preflight responsibility |
| --- | --- | --- | --- |
| Source fixture | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | Own source id, bounds, layers, and revision hash. |
| Terrain query | `n:world:terrain-raycast` | `n:goldrush:player-grounding` | Answer height, normal, slope, walkable, blocker, and material queries. |
| LOD | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | Derive near, mid, far, and horizon cells from the same fixture revision. |
| Placement | `n:world:placement-raycast` | `n:goldrush:desert-asset-family-protokits` | Place object protokits from anchors, masks, and downward raycast hits. |
| Gameplay | `n:world:zone-mask` | `n:goldrush:gold-and-extraction-zones` | Read route, gold, cover, mine, cashout, and pressure annotations. |
| Proof | `n:runtime:validation` | `n:goldrush:reality-status` | Reject consumers that cannot report fixture id and revision. |

## Exit Gate

The packet is ready for future implementation only when the matrix names the fixture fields, queries, consumers, validators, screenshots, public proof, restart behavior, and failure states.

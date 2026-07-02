# Source-First Terrain Production Gate

Status: active docs-only
Domain: world / render / physics / content / validation

## Purpose

Define the gate that decides when GoldRush terrain work is allowed to move from procedural prototype terrain into a drawn terrain source revision that every gameplay, physics, render, and content kit consumes.

## Why This Gate Exists

The current plateau is not mainly a lack of more props or another renderer pass. The map needs an authored source asset that gives the world a durable shape before LOD, collider parity, object protokits, gold zones, towns, rails, cover, extraction sites, and human-view proof can converge.

Without this gate, terrain work will keep splitting into small local wins:

- renderer looks better but collider disagrees
- collider works but routes are not authored
- objects are denser but do not describe the place
- LOD exists but has no source revision to compare against
- gameplay receipts pass but the map still feels synthetic

## Production Decision

The next terrain implementation should start by producing a small source fixture, then derive render chunks, collider samples, placement anchors, and gameplay masks from that fixture.

```txt
drawn source fixture
|-- revision metadata
|-- height and normal fields
|-- masks
|-- chunks and LOD rings
|-- placement anchors
|-- route and zone graph
`-- proof fixtures
    |-- renderer parity
    |-- collider parity
    |-- placement parity
    |-- gameplay route parity
    `-- public proof parity
```

## Gate Files

- `decision-matrix.md`
- `001-current-plateau-evidence.md`
- `002-source-revision-contract.md`
- `003-lod-chunk-readiness.md`
- `004-consumer-lockstep-gate.md`
- `005-digital-asset-layering-gate.md`
- `006-reference-signals.md`
- `007-implementation-simulation.md`

## Owning Kits

| Layer | Generic candidate | GoldRush candidate | Gate role |
| --- | --- | --- | --- |
| Source | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | Own the revision and source contract. |
| Query | `n:world:terrain-raycast` | `n:goldrush:player-grounding` | Prove player and placement samples come from source. |
| Collider | `n:physics:collider` | `n:goldrush:terrain-physics` | Prove visible and physical terrain match. |
| Render | `n:render:terrain-bands` | `n:goldrush:gold-field-renderer` | Prove chunks and LOD are source-derived. |
| Content | `n:render:micro-object-instancing` | `n:goldrush:desert-asset-family-protokits` | Prove objects layer onto source anchors. |
| Gameplay | `n:world:zone-mask` | `n:goldrush:gold-and-extraction-zones` | Prove mining, cover, cashout, and routes share masks. |
| Proof | `n:runtime:validation` | `n:goldrush:reality-status` | Prove local and public reports name source revision. |

## Stop Rule

Do not replace live terrain broadly until the first fixture proves:

- one source revision id flows through render, collider, placement, route, and proof
- source queries produce stable heights, normals, and masks
- renderer chunks have an LOD and seam policy
- collider mismatch is measured against the same source
- object protokit anchors are raycast placed against the source
- a natural player route can walk from spawn to a mine and cashout site


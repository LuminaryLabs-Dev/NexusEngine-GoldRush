# Source Artboard Production Workbook

Status: active docs-only
Date: 2026-07-01
Domain: world / art direction / render / physics / gameplay / validation

## Purpose

Define the literal source-artboard workbook for the massive GoldRush desert terrain. This is the missing bridge between "we need a drawn terrain kit" and "implementation can safely build terrain chunks." It keeps the work in docs/audit mode while making the next implementation pass concrete.

## Core Rule

The map should be drawn as layered source data before it is rendered as terrain.

```txt
source artboard
|-- scale and coordinates
|-- macro composition
|-- height and slope layers
|-- material and biome layers
|-- walkable and blocker layers
|-- route, rail, wash, town, mine, gold, cover, extraction, and pressure annotations
|-- asset stamp palette
|-- LOD cell overlays
`-- proof shot list
```

## Why This Exists

The current prototype can validate mechanics while still looking like a sparse procedural field. The source artboard prevents that by forcing the world to be designed as a place first, then converted into kit-owned terrain data.

## Files

- `artboard-matrix.md`
- `atomic-matrix.md`
- `research-matrix.md`
- `simulation-matrix.md`
- `audit-matrix.md`
- `001-artboard-intent.md`
- `002-layer-stack.md`
- `003-coordinate-and-scale-sheet.md`
- `004-macro-composition-sheet.md`
- `005-height-mask-authoring-sheet.md`
- `006-lod-extraction-sheet.md`
- `007-asset-stamp-palette.md`
- `008-gameplay-annotation-sheet.md`
- `009-proof-shot-list.md`
- `010-implementation-readiness-gate.md`
- `011-reference-notes.md`
- `audit-checklist.md`
- `fixture-preflight-001/`
- `atomic/`
- `research/`
- `simulations/`
- `audits/`

## Atomic Layer

The atomic layer breaks the workbook into 48 implementation-sized packets:

- 12 artboard sheet families.
- 4 layers per family: intent, data, consumer, and proof.
- 48 paired research notes.
- 48 implementation simulations.
- 48 hardening audits.

Future terrain implementation should select one atom and read its research, simulation, and audit before creating or changing terrain source code.

## Fixture Preflight

`fixture-preflight-001/` defines the first tiny source fixture gate, `goldrush.desert.artboard.fixture.001`. It names the minimum source fields, query contract, consumer readiness checks, validator plan, human-view proof, public proof, restart policy, implementation simulation, and hardening audit required before terrain implementation resumes.

The fixture preflight now has its own 24-atom layer, with paired research, simulations, and audits for source identity, bounds, height, normals, masks, annotations, anchors, raycast placement, LOD, renderer/collider/movement/gameplay parity, snapshots, reset, validation, human proof, public proof, and restart policy.

The first fixture atom now has a source-id and revision micro-runway so future implementation can prove identity, consumer echo, stale proof, and restart linkage before broader fixture code.

The second fixture atom now has a bounds, scale, and origin micro-runway so future implementation can prove coordinate system, unit scale, playable bounds, cell spacing, vertical range, boundary queries, traversal distances, LOD distances, partition scale, and physics/render parity before terrain expansion.

The third fixture atom now has a height sample micro-runway so future implementation can prove finite source-owned heights, normalization, offsets, cell addressing, interpolation, edge queries, proof points, render/collider parity, negative cases, and stale-proof behavior before terrain consumers expand.

The fourth fixture atom now has a normal and slope micro-runway so future implementation can prove source-owned normals, slope classes, walkability thresholds, sampleGround output, movement grounding, placement alignment, negative cases, and stale-proof behavior before terrain-footing consumers expand.

The fifth fixture atom now has a material and biome mask micro-runway so future implementation can prove source-owned surface tags, biome tags, mask weights, blend policy, render material selection, audio/VFX cues, placement filters, gameplay surface rules, negative cases, and stale-proof behavior before terrain surface consumers expand.

The sixth fixture atom now has a walkable and blocker mask micro-runway so future implementation can prove source-owned walkable classes, blocker classes, slope linkage, hole/overhang policy, movement rejection, placement rejection, bot staging parity, edge transition behavior, negative cases, and stale-proof behavior before navigation consumers expand.

The seventh fixture atom now has a route annotation micro-runway so future implementation can prove source-owned primary routes, alternate routes, branches, return lanes, route ids, corridor budgets, route risk tags, getZoneAt behavior, proof points, player guidance parity, AI staging parity, negative cases, and stale-proof behavior before traversal consumers expand.

The eighth fixture atom now has a mine and gold annotation micro-runway so future implementation can prove source-owned mine sites, gold seams, resource node ids, yield tiers, mine workspaces, resource readability, interaction anchors, renderer placement echo, hold-action echo, cargo/receipt echo, negative cases, and stale-proof behavior before resource gameplay consumers expand.

The ninth fixture atom now has a cover and pressure annotation micro-runway so future implementation can prove source-owned cover pockets, threat lanes, pressure seeds, sightline tags, route linkage, counterplay, combat proof points, pressure queries, renderer threat echo, combat-loop echo, negative cases, and stale-proof behavior before combat readability consumers expand.

The tenth fixture atom now has a cashout and extraction annotation micro-runway so future implementation can prove source-owned cashout sites, extraction radii, deposit anchors, return routes, risk/contest tags, readability tags, cashout queries, renderer marker echo, extraction hold echo, receipt/results echo, negative cases, and stale-proof behavior before extraction destination consumers expand.

The eleventh fixture atom now has a rail and train reference micro-runway so future implementation can prove source-owned rail splines, train stops, loading-yard links, train path queries, boarding sides, train motion states, rail/terrain parity, rail prop placement, camera handoff, train audio cues, negative cases, and stale-proof behavior before train scene, rail, boarding, camera, audio, or public proof consumers expand.

## Owning Kits

| Domain | Generic kit | GoldRush kit | Workbook role |
| --- | --- | --- | --- |
| Source artboard | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | Own the source revision and layer schema. |
| Terrain query | `n:world:terrain-raycast` | `n:goldrush:player-grounding` | Convert layers into height, normal, slope, and mask queries. |
| LOD | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | Convert cell overlays into near, mid, far, and horizon chunks. |
| Placement | `n:world:placement-raycast` | `n:goldrush:desert-asset-family-protokits` | Convert stamps and anchors into object protokit placement. |
| Gameplay | `n:world:zone-mask` | `n:goldrush:gold-and-extraction-zones` | Convert annotations into objective, cover, pressure, and extraction masks. |
| Proof | `n:runtime:validation` | `n:goldrush:reality-status` | Prove every consumer names the same source artboard revision. |

## Stop Rule

Do not implement broad terrain replacement until a tiny source artboard fixture can prove every required layer exists and can be sampled by at least one consumer without hidden local terrain logic.

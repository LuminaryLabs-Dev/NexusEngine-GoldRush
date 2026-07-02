# Plateau Breakthrough Terrain Kit

Status: active docs-only
Date: 2026-07-01
Domain: world / render / physics / content / gameplay / validation

## Purpose

Explain why the current GoldRush map is plateauing and convert that diagnosis into a production-ready drawn terrain kit plan. This packet does not implement the game. It defines the next source-data gate for a massive desert terrain mesh, LOD system, collider parity, raycast placement, object protokit anchors, and player-facing route readability.

## Core Answer

The current scene is plateauing because the systems around the map are becoming more advanced than the map source itself. The renderer can place more objects, the proof harness can verify more receipts, and the terrain can be scaled up, but none of that creates authored place identity unless the world has one source revision that defines terrain shape, silhouettes, material zones, routes, landmarks, risk lanes, object anchors, and proof samples.

## Required Direction

```txt
drawn terrain source revision
|-- macro silhouette and scale
|-- height, slope, normal, and material fields
|-- walkable, blocker, route, gold, cover, town, mine, rail, extraction, and final-rush masks
|-- chunk and LOD cells
|-- collider parity samples
|-- raycast placement anchors
|-- digital asset family anchors
|-- gameplay route and risk web
`-- local/public proof fixtures
```

## Packet Files

- `001-why-plateauing.md`
- `002-drawn-terrain-kit-charter.md`
- `003-source-data-contract.md`
- `004-lod-and-streaming-contract.md`
- `005-digital-asset-authoring-contract.md`
- `006-player-space-design-contract.md`
- `007-reference-research.md`
- `008-implementation-readiness-audit.md`
- `009-no-code-stop-conditions.md`
- `atomic-matrix.md`
- `research-matrix.md`
- `simulation-matrix.md`
- `audit-matrix.md`
- `atomic/`
- `research/`
- `simulations/`
- `audits/`

## Owning Kits

| Layer | Generic candidate | GoldRush kit | Role |
| --- | --- | --- | --- |
| Source | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | Own revision, coordinate scale, height, masks, and fixtures. |
| Query | `n:world:terrain-raycast` | `n:goldrush:player-grounding` | Sample height, slope, normal, masks, and placement hits. |
| LOD | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | Derive near, mid, far, and horizon cells from source. |
| Physics | `n:physics:collider` | `n:goldrush:terrain-physics` | Prove collision matches visible terrain. |
| Assets | `n:world:placement-raycast` | `n:goldrush:desert-asset-family-protokits` | Place each object family on source-derived anchors. |
| Gameplay | `n:world:zone-mask` | `n:goldrush:gold-and-extraction-zones` | Own route, risk, gold, cover, pressure, and cashout zones. |
| Proof | `n:runtime:validation` | `n:goldrush:reality-status` | Keep source revision, local proof, and public proof aligned. |

## Stop Rule

Do not make the live terrain bigger again until one small source fixture proves renderer, collider, placement, route, gameplay masks, and proof reports all consume the same terrain source revision.

# Massive Desert Map Blueprint

Status: active docs-only
Domain: world / art direction / gameplay / render / physics

## Purpose

Define what the drawn terrain source should actually become: a massive wild-west desert map with authored macro shape, extraction routes, terrain layers, object-family anchors, LOD cells, combat lanes, towns, mines, rails, and proof gates.

## Why This Exists

The source-first production gate says terrain must come from one source revision. This blueprint says what that source revision needs to contain so the game stops plateauing at "bigger procedural terrain" and starts becoming a readable extraction battle royale map.

## Map Intent

GoldRush should feel like a frontier claim region, not an arena:

```txt
outer horizon mesas
|-- distant silhouettes and LOD impostors
|-- playable ridges and blocker cliffs
|-- rail corridor and train approach
|-- mining washes and dry creek beds
|-- frontier town shelf
|-- mine shelf and cave entries
|-- central mountain obstacle
|-- gold seam risk lanes
|-- extraction depot and cashout routes
`-- final-rush pressure corridors
```

## Packet Files

- `001-macro-map-shape.md`
- `002-map-zones-and-pois.md`
- `003-terrain-layer-stack.md`
- `004-lod-streaming-cells.md`
- `005-gameplay-route-and-risk-web.md`
- `006-asset-anchor-blueprint.md`
- `007-source-data-blueprint.md`
- `008-reference-signals.md`
- `009-acceptance-gates.md`

## Owning Kits

| Domain | Generic kit | GoldRush kit | Blueprint role |
| --- | --- | --- | --- |
| World source | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | Own map source revision and macro layers. |
| Terrain query | `n:world:terrain-raycast` | `n:goldrush:player-grounding` | Answer height, normal, slope, and mask queries. |
| Streaming/LOD | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | Load near/mid/far terrain cells. |
| Asset placement | `n:world:placement-raycast` | `n:goldrush:desert-asset-family-protokits` | Place towns, rocks, plants, rails, mines, and setpieces. |
| Route graph | `n:world:route-graph` | `n:goldrush:player-route-guidance` | Define player, bot, train, and cashout routes. |
| Gameplay zones | `n:world:zone-mask` | `n:goldrush:gold-and-extraction-zones` | Feed gold, extraction, cover, and pressure masks. |
| Proof | `n:runtime:validation` | `n:goldrush:reality-status` | Prove every consumer uses the same source revision. |

## Main Rule

The map should be authored as a source asset first. Procedural systems may expand, decorate, simplify, or validate it, but they must not replace the authored source as the map authority.


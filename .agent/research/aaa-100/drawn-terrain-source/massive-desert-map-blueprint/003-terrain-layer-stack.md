# Terrain Layer Stack

Status: active docs-only
Domain: world / render / physics / content

## Purpose

Define the layered source data stack for a drawn terrain map.

## Layer Stack

```txt
sourceRevision
|-- baseHeight
|-- macroLandforms
|-- erosionAndWashes
|-- playableSlope
|-- blockerSlope
|-- materialBands
|-- biomeBands
|-- routeGraph
|-- zoneMasks
|-- placementAnchors
|-- chunkCells
|-- lodCells
`-- proofSamples
```

## Layer Matrix

| Layer | Data form | Consumer | Proof |
| --- | --- | --- | --- |
| baseHeight | grid or mesh samples | renderer, collider | height sample validator |
| macroLandforms | feature polygons | renderer, route graph | silhouette screenshots |
| erosionAndWashes | path masks | movement, bots, gold zones | route proof |
| playableSlope | mask | control, bots | natural walk proof |
| blockerSlope | mask | physics, camera | no-clipping proof |
| materialBands | masks | toon terrain renderer | screenshot palette proof |
| biomeBands | masks | object protokits | placement proof |
| routeGraph | graph | guidance, bots, train | route validator |
| zoneMasks | named masks | gameplay kits | mine/cashout proof |
| placementAnchors | points/areas | asset families | raycast placement proof |
| chunkCells | bounds | renderer, streaming | cell load proof |
| lodCells | level metadata | renderer | no-pop proof |

## Rule

Every visible object that is part of the world identity must be placed from either a source mask or a source anchor. Random scatter is allowed only as a detail layer after the authored layer exists.


# Drawn Terrain Source Contract

Status: active docs-only
Domain: world
Candidate neutral kit: `n:world:authored-terrain-mesh`
Candidate GoldRush kit: `n:goldrush:desert-world-map`

## Contract Shape

```txt
source asset
|-- metadata
|   |-- sourceId
|   |-- revisionHash
|   |-- worldBounds
|   |-- metersPerUnit
|   `-- authoringScale
|-- heightField
|-- normalField
|-- slopeField
|-- masks
|   |-- biome
|   |-- material
|   |-- walkable
|   |-- rail
|   |-- wash
|   |-- town
|   |-- mine
|   |-- gold
|   |-- cover
|   |-- extraction
|   `-- blocker
|-- chunks
|-- lodRings
|-- placementAnchors
|-- routeGraph
|-- gameplayZones
`-- proofFixtures
```

## Public API Seed

| API | Purpose |
| --- | --- |
| `loadSource(sourceId)` | Load a named authored terrain fixture. |
| `getHeight(x,z)` | Return source-derived ground height. |
| `getNormal(x,z)` | Return source-derived ground normal. |
| `getSlope(x,z)` | Return traversal/collider slope. |
| `getMask(maskId,x,z)` | Query source-authored masks. |
| `raycastDown(origin)` | Provide renderer and gameplay placement hits. |
| `getChunk(chunkId,lod)` | Provide renderable chunk metadata. |
| `getPlacementAnchors(filter)` | Feed object protokits. |
| `getRouteGraph(filter)` | Feed player guidance, combat, and extraction routing. |
| `getSnapshot()` | Expose source revision, loaded chunks, masks, and proof state. |

## Internal API Seed

| Internal capability | Notes |
| --- | --- |
| Coordinate transforms | Convert authoring space to runtime world space. |
| Sampling | Handle bilinear/nearest sampling and edge clamping. |
| Normal derivation | Keep render lighting and physics queries aligned. |
| Mask compression | Allow many masks without huge runtime payloads. |
| Chunk stitching | Prevent cracks and visible seams. |
| Revision checks | Prevent stale collider/render/proof sources from mixing. |
| Anchor expansion | Convert source anchors into prop-kit placement candidates. |
| Zone derivation | Convert source masks into GoldRush gameplay zones. |

## Data Matrix

| Data | Owned by | Consumed by | Proof |
| --- | --- | --- | --- |
| Height | `n:world:authored-terrain-mesh` | render, physics, control | sample fixture validator |
| Normals | `n:world:authored-terrain-mesh` | render, movement, placement | normal tolerance validator |
| Walkable mask | `n:world:authored-terrain-mesh` | player grounding, route guidance | natural walk proof |
| Material mask | `n:world:authored-terrain-mesh` | terrain bands, toon shader | screenshot comparison |
| Gold mask | `n:goldrush:desert-world-map` | mining, economy, route guidance | mine-route proof |
| Extraction mask | `n:goldrush:desert-world-map` | cashout, scoring, combat pressure | cashout-route proof |
| Cover mask | `n:goldrush:desert-world-map` | combat lanes, bot staging | combat route proof |
| Chunk LOD | `n:world:authored-terrain-mesh` | renderer, performance proof | seam and popping proof |

## Rule

Renderer meshes are not the source of truth. They are generated views of the source. Physics colliders and gameplay placement must be generated from the same source revision.


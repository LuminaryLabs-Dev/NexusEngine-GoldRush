# Mini Map Fixture Schema

Status: active docs-only
Domain: world / data
Future kit: `n:world:authored-terrain-mesh`

## Fixture Id

`goldrush.desert.fixture.001`

## Required Data

```txt
metadata
|-- sourceId
|-- revisionHash
|-- authoringTool
|-- coordinateSystem
|-- metersPerUnit
|-- createdFor
`-- approvalState

bounds
|-- minX
|-- maxX
|-- minZ
|-- maxZ
|-- minY
`-- maxY

sampleGrid
|-- sampleSpacing
|-- width
|-- depth
|-- heightValues
|-- normalPolicy
`-- slopePolicy

masks
|-- walkable
|-- blocker
|-- material
|-- biome
|-- route
|-- rail
|-- mine
|-- gold
|-- cover
`-- extraction

chunks
|-- chunkSize
|-- chunkIds
|-- lodLevels
|-- neighborEdges
`-- seamTolerance

anchors
|-- spawn
|-- mine
|-- town
|-- rail
|-- prop
|-- cover
`-- extraction

proofSamples
|-- heightSamples
|-- raycastSamples
|-- maskSamples
|-- routeSamples
|-- placementSamples
`-- colliderParitySamples
```

## Minimal Public Snapshot

```txt
sourceId
revisionHash
worldBounds
sampleSpacing
heightRange
maskIds
chunkCount
anchorCounts
validatorState
consumerReadiness
```

## Hard Rule

The schema must be serializable. Runtime proof should not depend on editor-only objects, WebGL objects, absolute paths, raw asset paths, or private renderer state.


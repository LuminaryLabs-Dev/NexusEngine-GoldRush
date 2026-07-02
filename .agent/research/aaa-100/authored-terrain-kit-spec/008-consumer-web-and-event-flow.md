# Consumer Web And Event Flow

Status: active docs-only

## Purpose

Show how authored terrain data should move through domain services without renderer-owned hidden logic.

## Flow

~~~txt
n:world:authored-terrain-mesh
|  emits terrainSourceLoaded, terrainChunkReady, terrainMaskReady
|
|-- n:goldrush:desert-world-map
|   emits desertMapLoaded, regionActivated, goldZoneResolved, extractionSiteResolved
|
|-- n:physics:terrain-collider-parity
|   emits colliderBuilt, colliderParityFailed, raycastSampled
|
|-- n:render:terrain-lod-rings
|   emits chunkMounted, lodTransitioned, seamProofFailed
|
|-- n:render:micro-object-instancing
|   consumes prop anchors and visual form roles
|
|-- n:control:character-movement
|   consumes ground samples and slope/walkability
|
|-- n:gameplay:interaction-hold
|   consumes object affordance anchors
|
|-- n:gameplay:extraction
|   consumes extraction site descriptors
|
`-- n:match:lifecycle
    consumes final-rush convergence descriptors
~~~

## Minimal Public APIs

- Terrain source: samples, masks, chunks, raycasts, snapshot.
- Desert map: gameplay zones, route guides, spawn candidates, map snapshot.
- Renderer: mounted chunk/prop evidence only.
- Physics: collider/raycast parity evidence only.
- Gameplay: zone and affordance consumption only.

## Rule

If a consumer needs data not exposed by the terrain source or desert map snapshot, update the source contract instead of creating a hidden renderer/gameplay duplicate.

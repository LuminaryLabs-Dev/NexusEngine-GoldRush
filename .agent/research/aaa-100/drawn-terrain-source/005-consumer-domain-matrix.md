# Consumer Domain Matrix

Status: active docs-only
Domain: architecture

## Purpose

Define how the drawn terrain source should feed the rest of the game without turning the renderer into the hidden game engine.

## Matrix

| Domain | Consumes from source | Exposes after consumption | Risk if skipped |
| --- | --- | --- | --- |
| Render | chunks, material masks, normals, LOD rings, anchors | visible terrain, silhouettes, prop batches | beautiful screenshot but broken gameplay truth |
| Physics | height, slope, blocker, walkable masks | terrain collider, ground probes, blocker contacts | floating, sinking, inside-out surfaces |
| Control | height, slope, route hints | grounded WASD, camera-relative traversal | movement feels disconnected from map |
| Gameplay | gold, extraction, route, cover masks | mine targets, cashout zones, risk states | loop feels fake or debug-driven |
| Combat | cover lanes, sightlines, blocker masks | threat staging, readable ambush paths | combat feels arbitrary |
| Network | source revision, region ids, room partition windows | deterministic room/map snapshots | peers disagree about map state |
| Staging | route graph, test fixtures | single-player scenario runs | tests prove helpers instead of gameplay |
| Proof | fixtures, source revision, screenshots, movement videos | local/public pass/fail evidence | false confidence from narrow checks |

## Event Flow

```txt
terrainSourceLoaded
-> chunksReady
-> masksReady
-> desertMapResolved
-> placementAnchorsReady
-> gameplayZonesReady
-> colliderBuilt
-> renderChunksMounted
-> proofSnapshotReady
```

## Public Snapshot Seed

```txt
sourceRevision
worldBounds
activeChunks
loadedLodRings
maskIds
walkableCoverage
routeCoverage
placementAnchorCounts
gameplayZoneCounts
colliderRevision
rendererRevision
proofStatus
```

## Architecture Rule

Only source and kit snapshots should cross domains. Private geometry buffers, renderer objects, imported raw paths, or one-off debug coordinates should not become the coordination layer.


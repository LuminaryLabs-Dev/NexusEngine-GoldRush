# Drawn Terrain Kit Charter

Status: active docs-only

## Kit Pair

| Type | Kit | Purpose |
| --- | --- | --- |
| Generic incubator | `n:world:authored-terrain-mesh` | Load, validate, snapshot, and query authored terrain source data. |
| GoldRush custom | `n:goldrush:desert-world-map` | Convert source terrain into the GoldRush frontier map, routes, risk zones, and content anchors. |

## Public API

- `loadSourceRevision(revisionId)`
- `getBounds()`
- `sampleHeight(x, z)`
- `sampleNormal(x, z)`
- `sampleMasks(x, z)`
- `getChunk(cellId, lodLevel)`
- `getPlacementAnchors(familyId)`
- `getRouteGraph(routeSetId)`
- `getProofSamples()`

## Events

- `terrain.source.loaded`
- `terrain.source.invalid`
- `terrain.chunk.ready`
- `terrain.collider.ready`
- `terrain.anchors.ready`
- `terrain.proof.sampled`

## Snapshot

The snapshot should expose revision id, bounds, source dimensions, chunk counts, active LOD rings, mask names, anchor counts, route counts, proof sample counts, and validation status.

## Internal API

Internal APIs may triangulate chunks, simplify horizon meshes, build collider samples, normalize masks, and derive anchors. UI, gameplay, and renderer code should not bypass the public kit contract.

## Graduation Rule

The generic kit can graduate only if it has no GoldRush names, no wild-west rules, no asset-specific assumptions, and validators for source loading, chunk generation, query stability, reset, snapshot, and serialization.

# Generic Kit Contract - Authored Terrain Mesh

Status: active docs-only

1. domainPath: n:world:authored-terrain-mesh.
2. purpose: Provide a neutral authored terrain source contract for height, normal, slope, masks, chunks, and raycast samples.
3. publicApi: loadSource(sourceId), getHeight(x,z), getNormal(x,z), getMask(maskId,x,z), getChunk(chunkId), raycastDown(origin), getSnapshot().
4. internalApi: source decoding, coordinate transforms, chunk index lookup, bilinear sampling, normal derivation, mask compression, edge stitching, revision hash checks.
5. events: terrainSourceLoaded, terrainChunkReady, terrainMaskReady, terrainSourceRejected, terrainRevisionChanged.
6. snapshot: source id, revision hash, world bounds, grid resolution, chunk count, active chunks, mask ids, validation status, sample tolerances.
7. reset: clear loaded chunks, masks, source revision, cached samples, and validation receipts without touching downstream GoldRush game state.
8. dataExposed: serializable source metadata, numeric samples, chunk descriptors, masks, and proof receipts; no renderer meshes as authority.
9. validator: future CLI validator must compare source samples, chunk seams, masks, and raycast outputs against fixtures before renderer use.
10. graduationRule: promotable only if it has no GoldRush naming, no game rules, no asset-specific assumptions, stable API/events/snapshot/reset, and fixture-based validation.

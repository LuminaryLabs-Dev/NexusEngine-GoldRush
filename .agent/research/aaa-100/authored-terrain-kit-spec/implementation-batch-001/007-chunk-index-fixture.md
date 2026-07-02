# Chunk Index Fixture

Status: active docs-only

Packet: 007
Domain: world
Target kit: n:world:terrain-patches
Roadmap atoms: 024, 026

## Purpose

Define map chunks as the stable bridge between authored source data, LOD rings, streaming, physics sectors, and proof capture.

## Why This Prevents Plateau

The map cannot scale to massive terrain if everything renders or collides as one broad procedural blob.

## Data Exposed

- chunkId
- bounds
- lodClass
- heightRange
- maskCoverage
- neighborIds
- proofAnchor

## Public API Shape

- getChunkAt(point)
- listChunksInBounds(bounds)
- getChunkNeighbors(chunkId)

## Events And Snapshot

- terrainChunkActivated
- terrainChunkDeactivated
- terrainChunkMismatch

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI confirms complete bounds coverage without gaps
- CLI checks neighbor seams share border heights
- human-view proof captures near, mid, and far chunk continuity

## Edge Cases And Stop Conditions

- Do not key gameplay state to render-only chunk lifetime.
- Do not allow visible seams at chunk borders.
- Stop if collider chunks use different bounds than render chunks.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

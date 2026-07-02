# Render Consumer Contract

Status: active docs-only

Packet: 013
Domain: render
Target kit: n:render:three-scene plus n:render:terrain-bands
Roadmap atoms: 022, 024, 040

## Purpose

Define how rendering consumes authored terrain source data without becoming the owner of gameplay truth.

## Why This Prevents Plateau

Visual polish plateaus if the renderer keeps drawing surfaces that physics, controls, and gameplay cannot verify.

## Data Exposed

- terrainMeshDescriptor
- materialRoles
- chunkDrawList
- lodBands
- propInstanceBatches
- debugOverlayFlags

## Public API Shape

- renderTerrainSource(sourceSnapshot)
- renderPropBatch(batch)
- getRenderTerrainSnapshot()

## Events And Snapshot

- terrainRenderReady
- terrainRenderOutOfSync
- propBatchRendered

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- browser proof rejects blank canvas and underside triangles
- screenshot proof checks horizon, route, landmark, and near-ground readability

## Edge Cases And Stop Conditions

- Do not smooth away collision-critical terrain forms.
- Do not draw debug masks in normal player mode.
- Stop if the renderer consumes raw source files directly instead of kit snapshots.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

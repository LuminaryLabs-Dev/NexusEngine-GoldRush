# LOD Band Fixture

Status: active docs-only

Packet: 010
Domain: render
Target kit: n:render:terrain-bands
Roadmap atoms: 024

## Purpose

Define visible terrain LOD rings without letting visual LOD alter gameplay height, mask, or collider truth.

## Why This Prevents Plateau

Massive terrain will stay unreliable if LOD is treated as a visual shortcut instead of a consumer of stable source data.

## Data Exposed

- lodBandId
- distanceMin
- distanceMax
- targetResolution
- materialRole
- chunkIds
- sourceRevisionHash

## Public API Shape

- selectLodBand(cameraPoint)
- buildTerrainMeshForBand(bandId)
- getLodSnapshot()

## Events And Snapshot

- terrainLodBandSelected
- terrainLodMeshBuilt
- terrainLodMismatch

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI checks every chunk has exactly one active visual band per distance
- browser proof captures near/mid/far terrain without holes
- public smoke report records LOD revision

## Edge Cases And Stop Conditions

- Do not derive physics from render LOD mesh.
- Do not pop critical gameplay markers with terrain LOD.
- Stop if LOD seams expose sky or underside triangles.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

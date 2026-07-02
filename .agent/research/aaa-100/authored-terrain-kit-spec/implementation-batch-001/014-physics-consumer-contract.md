# Physics Consumer Contract

Status: active docs-only

Packet: 014
Domain: physics
Target kit: n:physics:world plus n:physics:collider plus n:physics:query
Roadmap atoms: 026

## Purpose

Define how physics consumes authored height, blocker, and query data as a stable backend-swappable service.

## Why This Prevents Plateau

Physics stays fragile when the game depends on whichever mesh happened to render instead of a declared terrain collider source.

## Data Exposed

- gravity
- terrainColliderDescriptor
- blockerDescriptors
- queryPolicy
- backendName
- revisionHash

## Public API Shape

- stepPhysics(dt)
- registerTerrainCollider(descriptor)
- queryGround(point)
- queryCapsuleSweep(capsule)

## Events And Snapshot

- physicsWorldReady
- physicsTerrainSynced
- physicsQueryFailed

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI validates collider build and query response
- movement proof checks no sinking, floating, or under-map travel
- backend comparison notes Rapier/Cannon capability

## Edge Cases And Stop Conditions

- Do not make physics optional for gameplay movement once terrain is loaded.
- Do not hide backend mismatch with visual correction.
- Stop if queries cannot identify terrain chunk and source revision.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

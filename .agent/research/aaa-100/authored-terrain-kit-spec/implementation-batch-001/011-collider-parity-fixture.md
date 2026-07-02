# Collider Parity Fixture

Status: active docs-only

Packet: 011
Domain: physics
Target kit: n:physics:collider
Roadmap atoms: 026

## Purpose

Define the proof that the terrain collider matches the visible authored terrain source closely enough for player grounding and traversal.

## Why This Prevents Plateau

The camera and character keep feeling broken when physics is asked to guess terrain shape after render has already invented it.

## Data Exposed

- colliderBackend
- colliderShapeClass
- heightSourceRevision
- sampleTolerance
- walkableSlopeMax
- blockerBounds

## Public API Shape

- buildTerrainCollider(source)
- sampleColliderHeight(point)
- assertColliderParity(points)

## Events And Snapshot

- terrainColliderBuilt
- terrainColliderParityFailed
- terrainColliderReady

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI compares collider and height grid at canonical sample points
- Playwright movement proof checks player stays above terrain through a route
- snapshot records backend and revision

## Edge Cases And Stop Conditions

- Do not call the terrain ready until collider parity passes.
- Do not let collision fallback be an infinite flat plane.
- Stop if Rapier/Cannon backend cannot express required heightfield shape.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

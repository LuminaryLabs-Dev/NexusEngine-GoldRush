# Normal Slope Derivation

Status: active docs-only

Packet: 005
Domain: world
Target kit: n:world:terrain-raycast
Roadmap atoms: 023, 026

## Purpose

Define one derivation path for normals and slopes so movement, placement, visual shading, and blockers agree.

## Why This Prevents Plateau

The terrain reads fake when slopes look walkable but movement, placement, or physics treats them differently.

## Data Exposed

- normalSamples
- slopeDegrees
- walkableSlopeMax
- placementSlopeMax
- blockerSlopeMin

## Public API Shape

- sampleGroundFrame(point)
- isWalkable(point)
- isPlaceable(point, placementClass)

## Events And Snapshot

- groundFrameSampled
- slopeClassified
- terrainSlopeRejected

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI verifies slope classes at ridges, washes, roads, and cliff bases
- human-view proof checks that steep mountains block instead of invite movement

## Edge Cases And Stop Conditions

- Do not hand-author separate slope maps without revision linkage.
- Do not place objects on slopes beyond their class limit.
- Stop if character grounding uses a different normal source.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

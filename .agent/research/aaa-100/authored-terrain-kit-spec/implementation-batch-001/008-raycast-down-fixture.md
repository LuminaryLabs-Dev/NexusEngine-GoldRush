# Raycast Down Fixture

Status: active docs-only

Packet: 008
Domain: world
Target kit: n:world:terrain-raycast
Roadmap atoms: 023, 026, 040

## Purpose

Define the vertical terrain query used to spawn the player, place props, anchor interaction zones, and correct gameplay markers.

## Why This Prevents Plateau

The current scene looks unstable because assets can appear under, above, or inside the terrain when placement is not grounded by one query.

## Data Exposed

- origin
- direction
- maxDistance
- hitPoint
- hitNormal
- hitSlope
- hitChunkId
- hitMaskClasses

## Public API Shape

- raycastDown(point, options)
- requireGroundHit(point, purpose)
- projectToGround(point, purpose)

## Events And Snapshot

- terrainRaycastHit
- terrainRaycastMiss
- terrainProjectionCorrected

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI raycasts all canonical spawn, prop, mine, town, rail, and extraction anchors
- browser proof verifies no critical object floats or sinks at load

## Edge Cases And Stop Conditions

- Never silently accept a missing raycast hit for gameplay objects.
- Define fallback only for debug views.
- Stop if any gameplay anchor is placed before terrain source readiness.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

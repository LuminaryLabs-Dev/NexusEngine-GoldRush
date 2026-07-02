# Placement Anchor Fixture

Status: active docs-only

Packet: 009
Domain: world
Target kit: n:world:placement-raycast
Roadmap atoms: 021, 023, 040

## Purpose

Define authored anchor records that procedural prop protokits consume after terrain raycast grounding.

## Why This Prevents Plateau

Procedural assets are acceptable only when each instance has authored intent, placement class, and proofable grounding.

## Data Exposed

- anchorId
- anchorClass
- positionXZ
- yaw
- scaleRange
- maskRequirements
- slopeLimit
- consumerKit

## Public API Shape

- listAnchorsByClass(className)
- resolveAnchor(anchorId)
- groundAnchor(anchorId)

## Events And Snapshot

- placementAnchorResolved
- placementAnchorRejected
- placementAnchorConsumed

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI rejects anchors outside playable bounds
- CLI checks every anchor maps to a protokit consumer
- human-view proof checks landmark anchors are readable

## Edge Cases And Stop Conditions

- Do not use anonymous random scatters for hero objects.
- Do not let two kits claim the same exclusive anchor.
- Stop if anchor grounding changes yaw/scale in a non-deterministic way.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

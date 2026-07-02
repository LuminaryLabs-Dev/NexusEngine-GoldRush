# Mask Stack Fixture

Status: active docs-only

Packet: 006
Domain: world
Target kit: n:world:terrain-patches
Roadmap atoms: 021, 022, 023, 040

## Purpose

Define terrain masks for biome bands, roads, rails, town pads, gold seams, combat cover, spawn safety, and extraction zones.

## Why This Prevents Plateau

Object density does not become authored space unless each object knows why it belongs in that part of the map.

## Data Exposed

- maskId
- maskType
- resolution
- blendMode
- priority
- semanticClass
- revisionHash

## Public API Shape

- sampleMask(maskId, x, z)
- listMasksByClass(className)
- getMaskStackSnapshot()

## Events And Snapshot

- terrainMaskLoaded
- terrainMaskConflict
- terrainMaskSampled

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI checks every gameplay zone has a backing mask
- CLI detects overlapping incompatible masks
- browser proof renders optional mask overlay in debug only

## Edge Cases And Stop Conditions

- Do not let masks become hidden gameplay rules without docs.
- Do not use scatter randomness where a semantic mask is required.
- Stop if gold, extraction, and combat masks contradict route flow.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

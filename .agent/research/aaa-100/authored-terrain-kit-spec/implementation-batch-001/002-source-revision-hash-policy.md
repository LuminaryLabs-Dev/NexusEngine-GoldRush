# Source Revision Hash Policy

Status: active docs-only

Packet: 002
Domain: runtime
Target kit: n:runtime:snapshot plus n:world:authored-terrain-mesh
Roadmap atoms: 021, 023, 024, 026

## Purpose

Define how authored terrain changes are identified so proofs, screenshots, colliders, and deploy reports can agree on the same map revision.

## Why This Prevents Plateau

The project plateaus when visual feedback cannot be traced back to a specific source revision and old proof keeps looking current.

## Data Exposed

- sourceRevisionHash
- heightRevisionHash
- maskRevisionHash
- chunkRevisionHash
- colliderRevisionHash
- renderRevisionHash

## Public API Shape

- computeSourceRevision(input)
- assertConsumerRevision(consumerName)
- getRevisionSnapshot()

## Events And Snapshot

- terrainRevisionComputed
- terrainConsumerMismatch
- terrainRevisionAccepted

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI fails if render and collider revisions differ
- public smoke report includes sanitized revision labels
- snapshot contains revision labels but no machine paths

## Edge Cases And Stop Conditions

- Hash logical content, not absolute file paths.
- Do not include local usernames or import locations in reports.
- Stop if a consumer can bypass revision assertions.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

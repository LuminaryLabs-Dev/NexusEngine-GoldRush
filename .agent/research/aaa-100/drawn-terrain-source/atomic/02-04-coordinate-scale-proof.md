# Coordinate And Scale - Proof Gate

Status: planned docs-only
Parent: drawn terrain source
Domain: world
Candidate generic kit: n:world:authored-terrain-mesh
Candidate GoldRush kit: n:goldrush:desert-world-map

## Atomic Goal

define the validator or human-view proof that blocks false completion for the drawn GoldRush desert terrain source.

## Why It Matters

This atom prevents map feels too small or inconsistent from surviving into the terrain implementation. It keeps the massive desert map source useful to render, physics, gameplay, staging, proof, and future 60-player room orchestration.

## Data Seed

world bounds, meters per unit, origin, authoring scale.

## Public API Seed

- Query source revision and status.
- Return serializable descriptors only.
- Expose stable ids, bounds, masks, anchors, or proof receipts relevant to this atom.
- Keep config minimal: ids, feature flags, tuning defaults, and fixture names.

## Internal API Seed

- Decode and validate source data.
- Resolve authoring-space to runtime-space coordinates.
- Cache deterministic samples by source revision.
- Reject stale consumer requests when revision hashes differ.

## Event Seed

- sourceAtomResolved
- sourceAtomRejected
- sourceConsumerReady
- sourceProofFailed

## Snapshot Seed

- atom id: 02-04-coordinate-scale-proof
- source revision
- domain owner
- consumer readiness
- validation state
- unresolved risks

## Validator Or Proof

future validator plus human-view proof when player-facing.

## Stop Condition

Stop if proof cannot detect map feels too small or inconsistent.

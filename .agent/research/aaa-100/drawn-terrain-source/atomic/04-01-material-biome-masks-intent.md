# Material And Biome Masks - Intent

Status: planned docs-only
Parent: drawn terrain source
Domain: world/render/art
Candidate generic kit: n:world:authored-terrain-mesh
Candidate GoldRush kit: n:goldrush:desert-world-map

## Atomic Goal

state the player-facing and domain reason this terrain source concern exists for the drawn GoldRush desert terrain source.

## Why It Matters

This atom prevents one-note desert material read from surviving into the terrain implementation. It keeps the massive desert map source useful to render, physics, gameplay, staging, proof, and future 60-player room orchestration.

## Data Seed

sand, clay, rock, wash, trail, mine, town material masks.

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

- atom id: 04-01-material-biome-masks-intent
- source revision
- domain owner
- consumer readiness
- validation state
- unresolved risks

## Validator Or Proof

future source fixture validator.

## Stop Condition

Stop if material and biome masks is described as visual polish instead of a source-owned gameplay concern.

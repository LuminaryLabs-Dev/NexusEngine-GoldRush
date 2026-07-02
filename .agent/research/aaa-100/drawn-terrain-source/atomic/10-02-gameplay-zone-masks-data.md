# Gameplay Zone Masks - Data Fixture

Status: planned docs-only
Parent: drawn terrain source
Domain: gameplay/world
Candidate generic kit: n:world:zone-mask
Candidate GoldRush kit: n:goldrush:gold-and-extraction-zones

## Atomic Goal

define the smallest source-data fixture needed before runtime use for the drawn GoldRush desert terrain source.

## Why It Matters

This atom prevents mining and extraction feel debug-placed from surviving into the terrain implementation. It keeps the massive desert map source useful to render, physics, gameplay, staging, proof, and future 60-player room orchestration.

## Data Seed

gold zones, extraction zones, combat pressure zones, final rush candidates.

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

- atom id: 10-02-gameplay-zone-masks-data
- source revision
- domain owner
- consumer readiness
- validation state
- unresolved risks

## Validator Or Proof

future source fixture validator.

## Stop Condition

Stop if the fixture omits gold zones, extraction zones, combat pressure zones, final rush candidates.

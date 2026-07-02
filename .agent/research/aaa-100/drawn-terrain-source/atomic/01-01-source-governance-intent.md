# Source Governance - Intent

Status: planned docs-only
Parent: drawn terrain source
Domain: governance/world
Candidate generic kit: n:world:authored-terrain-mesh
Candidate GoldRush kit: n:goldrush:desert-world-map

## Atomic Goal

state the player-facing and domain reason this terrain source concern exists for the drawn GoldRush desert terrain source.

## Why It Matters

This atom prevents source revision drift from surviving into the terrain implementation. It keeps the massive desert map source useful to render, physics, gameplay, staging, proof, and future 60-player room orchestration.

## Data Seed

source id, revision hash, ownership state, approval state.

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

- atom id: 01-01-source-governance-intent
- source revision
- domain owner
- consumer readiness
- validation state
- unresolved risks

## Validator Or Proof

future source fixture validator.

## Stop Condition

Stop if source governance is described as visual polish instead of a source-owned gameplay concern.

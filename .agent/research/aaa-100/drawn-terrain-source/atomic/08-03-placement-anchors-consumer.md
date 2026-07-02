# Placement Anchors - Consumer Contract

Status: planned docs-only
Parent: drawn terrain source
Domain: world/content
Candidate generic kit: n:world:placement-raycast
Candidate GoldRush kit: n:goldrush:desert-prop-kits

## Atomic Goal

name every domain that consumes this source data and what it receives for the drawn GoldRush desert terrain source.

## Why It Matters

This atom prevents objects scatter without map purpose from surviving into the terrain implementation. It keeps the massive desert map source useful to render, physics, gameplay, staging, proof, and future 60-player room orchestration.

## Data Seed

anchor ids, placement masks, downward hits, slope filters.

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

- atom id: 08-03-placement-anchors-consumer
- source revision
- domain owner
- consumer readiness
- validation state
- unresolved risks

## Validator Or Proof

future source fixture validator.

## Stop Condition

Stop if renderer-only state becomes the cross-domain authority.

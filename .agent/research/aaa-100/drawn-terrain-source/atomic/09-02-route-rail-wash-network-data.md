# Route Rail And Wash Network - Data Fixture

Status: planned docs-only
Parent: drawn terrain source
Domain: world/control/gameplay
Candidate generic kit: n:world:route-graph
Candidate GoldRush kit: n:goldrush:player-route-guidance

## Atomic Goal

define the smallest source-data fixture needed before runtime use for the drawn GoldRush desert terrain source.

## Why It Matters

This atom prevents the map lacks readable movement rhythm from surviving into the terrain implementation. It keeps the massive desert map source useful to render, physics, gameplay, staging, proof, and future 60-player room orchestration.

## Data Seed

route graph, rail spline, wash path, travel costs, visibility hints.

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

- atom id: 09-02-route-rail-wash-network-data
- source revision
- domain owner
- consumer readiness
- validation state
- unresolved risks

## Validator Or Proof

future source fixture validator.

## Stop Condition

Stop if the fixture omits route graph, rail spline, wash path, travel costs, visibility hints.

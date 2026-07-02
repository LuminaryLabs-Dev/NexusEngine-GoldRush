# Partition Snapshot Contract

Status: active docs-only

Atom ID: 001-02
Parent packet: 001 - 60 Player Product Pillar Gap
Domain: network/product/runtime
Owner: n:network:room-partitions plus n:goldrush:room-orchestration

## Atomic Objective

Require every room partition to expose a stable sanitized snapshot for staged scale proof.

## Source Context

Apex frames 60-person battle royale as a product pillar, while GoldRush must keep partitions internal and evidence public-facing readiness honestly.

## Data Contract Seed

partition id, active count, high-water count, handoff count, simulated count

## Event And Snapshot Seed

Event: partitionSnapshotUpdated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

CLI compares partition totals against match target

## Research Pair

- research/001-02-partition-snapshot-contract-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

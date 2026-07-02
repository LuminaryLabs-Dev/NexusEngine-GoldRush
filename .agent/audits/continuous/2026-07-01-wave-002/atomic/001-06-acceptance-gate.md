# Acceptance Gate

Status: active docs-only

Atom ID: 001-06
Parent packet: 001 - 60 Player Product Pillar Gap
Domain: network/product/runtime
Owner: n:network:room-partitions plus n:goldrush:room-orchestration

## Atomic Objective

Define the minimum evidence before any roadmap row can say 60-player ready.

## Source Context

Apex frames 60-person battle royale as a product pillar, while GoldRush must keep partitions internal and evidence public-facing readiness honestly.

## Data Contract Seed

gate id, proof set, unresolved caveats, next expansion target

## Event And Snapshot Seed

Event: scaleReadinessGateEvaluated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

gate stays open until staging and public proof match claim scope

## Research Pair

- research/001-06-acceptance-gate-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

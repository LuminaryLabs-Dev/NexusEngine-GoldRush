# Public Proof Labeling

Status: active docs-only

Atom ID: 001-04
Parent packet: 001 - 60 Player Product Pillar Gap
Domain: network/product/runtime
Owner: n:network:room-partitions plus n:goldrush:room-orchestration

## Atomic Objective

Make public proof reports label local, public, simulated, live, and peer-tested participants separately.

## Source Context

Apex frames 60-person battle royale as a product pillar, while GoldRush must keep partitions internal and evidence public-facing readiness honestly.

## Data Contract Seed

proof target, browser count, bot count, live peer count, caveat text

## Event And Snapshot Seed

Event: publicScaleProofLabeled

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

report sanitizer and scale-label validator pass

## Research Pair

- research/001-04-public-proof-labeling-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

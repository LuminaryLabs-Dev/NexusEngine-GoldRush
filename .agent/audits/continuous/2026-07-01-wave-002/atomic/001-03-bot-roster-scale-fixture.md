# Bot Roster Scale Fixture

Status: active docs-only

Atom ID: 001-03
Parent packet: 001 - 60 Player Product Pillar Gap
Domain: network/product/runtime
Owner: n:network:room-partitions plus n:goldrush:room-orchestration

## Atomic Objective

Define bot roster roles that can stand in for early 60-player pacing without pretending to be live peers.

## Source Context

Apex frames 60-person battle royale as a product pillar, while GoldRush must keep partitions internal and evidence public-facing readiness honestly.

## Data Contract Seed

bot role, route objective, pressure behavior, extraction intent, combat intent

## Event And Snapshot Seed

Event: stagingBotRosterBuilt

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

simulation proves at least 20 first, then expands toward 60

## Research Pair

- research/001-03-bot-roster-scale-fixture-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

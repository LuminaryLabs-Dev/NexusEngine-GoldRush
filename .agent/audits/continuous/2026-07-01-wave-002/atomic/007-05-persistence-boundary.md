# Persistence Boundary

Status: active docs-only

Atom ID: 007-05
Parent packet: 007 - Loot Economy And Loadout Gap
Domain: gameplay/content/progression
Owner: n:gameplay:cargo plus n:goldrush:economy

## Atomic Objective

Define what persists after a match and what remains run-local.

## Source Context

Battle royale readability depends on resources, equipment, and rewards; GoldRush should translate that into gold, tools, weapons, and extraction tokens.

## Data Contract Seed

state key, persistence class, reset rule, save eligibility

## Event And Snapshot Seed

Event: economyPersistenceClassified

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

save/load proof required before persistence

## Research Pair

- research/007-05-persistence-boundary-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

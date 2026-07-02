# Economy Value Table

Status: active docs-only

Atom ID: 007-01
Parent packet: 007 - Loot Economy And Loadout Gap
Domain: gameplay/content/progression
Owner: n:gameplay:cargo plus n:goldrush:economy

## Atomic Objective

Define value tiers for gold, ore, claims, tools, and cashout modifiers.

## Source Context

Battle royale readability depends on resources, equipment, and rewards; GoldRush should translate that into gold, tools, weapons, and extraction tokens.

## Data Contract Seed

item class, base value, rarity, risk scalar, persistence class

## Event And Snapshot Seed

Event: economyValueLoaded

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

validator rejects missing value tiers

## Research Pair

- research/007-01-economy-value-table-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

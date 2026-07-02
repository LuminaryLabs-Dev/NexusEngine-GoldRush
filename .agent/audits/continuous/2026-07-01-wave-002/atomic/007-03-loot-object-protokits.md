# Loot Object Protokits

Status: active docs-only

Atom ID: 007-03
Parent packet: 007 - Loot Economy And Loadout Gap
Domain: gameplay/content/progression
Owner: n:gameplay:cargo plus n:goldrush:economy

## Atomic Objective

Ensure every loot object is a protokit with placement and interaction ownership.

## Source Context

Battle royale readability depends on resources, equipment, and rewards; GoldRush should translate that into gold, tools, weapons, and extraction tokens.

## Data Contract Seed

protokit id, object class, anchor rule, interaction role

## Event And Snapshot Seed

Event: lootProtokitRegistered

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

content validator rejects unowned loot

## Research Pair

- research/007-03-loot-object-protokits-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

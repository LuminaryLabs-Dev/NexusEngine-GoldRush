# Tool Loadout Contract

Status: active docs-only

Atom ID: 007-02
Parent packet: 007 - Loot Economy And Loadout Gap
Domain: gameplay/content/progression
Owner: n:gameplay:cargo plus n:goldrush:economy

## Atomic Objective

Define shovel, pan, pick, satchel, revolver, and utility slots without bloating early scope.

## Source Context

Battle royale readability depends on resources, equipment, and rewards; GoldRush should translate that into gold, tools, weapons, and extraction tokens.

## Data Contract Seed

slot id, item id, action, cooldown, allowed mode

## Event And Snapshot Seed

Event: loadoutSlotUpdated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

proof shows equipped tool affects available action

## Research Pair

- research/007-02-tool-loadout-contract-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

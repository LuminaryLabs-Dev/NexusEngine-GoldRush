# Loadout Ui Minimalism

Status: active docs-only

Atom ID: 007-06
Parent packet: 007 - Loot Economy And Loadout Gap
Domain: gameplay/content/progression
Owner: n:gameplay:cargo plus n:goldrush:economy

## Atomic Objective

Keep equipment readable without turning the first screen into an inventory manager.

## Source Context

Battle royale readability depends on resources, equipment, and rewards; GoldRush should translate that into gold, tools, weapons, and extraction tokens.

## Data Contract Seed

hero slot, advanced slot, folded controls, prompt copy

## Event And Snapshot Seed

Event: loadoutUiGateEvaluated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

UX proof keeps hero actions minimal

## Research Pair

- research/007-06-loadout-ui-minimalism-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

# Loot Economy And Loadout Gap

Status: active docs-only

ID: 007
Domain: gameplay/content/progression
Severity: medium
Owner: n:gameplay:cargo plus n:goldrush:economy
Roadmap rows informed: 058, 063, 064, 069, 072, 096

## Reference Observation

Battle royale games rely on readable equipment, resources, and reward pacing. GoldRush can make gold, tools, weapons, and extraction tokens the western equivalent, but they need kit-owned rules.

## GoldRush Gap

Gold is represented, but tools, weapons, consumables, upgrades, loot containers, economy pacing, and risk/reward tuning are not yet full systems.

## Kit Implications

- economy kit owns values and modifiers
- equipment kit owns tools and weapon slots
- content protokits own physical loot objects
- progression kit owns what persists between matches

## Evidence Required Before Calling This Resolved

- data matrix for item roles and persistence boundaries
- validator rejecting unowned loot effects
- results proof showing rewards without leaking debug IDs

## Edge Cases

- do not add inventory complexity before extraction stakes work
- do not let loot be static decoration
- do not persist rewards without save/progression gates

## Docs-Only Rule

This packet does not authorize runtime changes. It defines what the next implementation packet must prove before the gap can be marked resolved.

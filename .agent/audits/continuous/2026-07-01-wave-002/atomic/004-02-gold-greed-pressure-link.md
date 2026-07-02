# Gold Greed Pressure Link

Status: active docs-only

Atom ID: 004-02
Parent packet: 004 - Zone Pressure Pacing Gap
Domain: battle royale/match/gameplay
Owner: n:gameplay:combat-pressure plus n:goldrush:final-rush-pressure

## Atomic Objective

Tie carried gold value and noise to pressure so greed changes risk.

## Source Context

PUBG describes zone pressure as pacing movement, positioning, combat, survivor flow, and risk choices; GoldRush needs pressure to shape extraction decisions.

## Data Contract Seed

carried value, noise bonus, pressure scalar, extraction urgency

## Event And Snapshot Seed

Event: goldGreedPressureUpdated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

receipt proof shows greed affects pressure

## Research Pair

- research/004-02-gold-greed-pressure-link-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

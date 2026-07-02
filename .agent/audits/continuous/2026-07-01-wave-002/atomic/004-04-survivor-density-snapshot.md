# Survivor Density Snapshot

Status: active docs-only

Atom ID: 004-04
Parent packet: 004 - Zone Pressure Pacing Gap
Domain: battle royale/match/gameplay
Owner: n:gameplay:combat-pressure plus n:goldrush:final-rush-pressure

## Atomic Objective

Track player or bot density per phase so convergence can be tuned.

## Source Context

PUBG describes zone pressure as pacing movement, positioning, combat, survivor flow, and risk choices; GoldRush needs pressure to shape extraction decisions.

## Data Contract Seed

phase id, alive count, POI density, encounter distance, extraction count

## Event And Snapshot Seed

Event: survivorDensitySampled

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

staging report records density over time

## Research Pair

- research/004-04-survivor-density-snapshot-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

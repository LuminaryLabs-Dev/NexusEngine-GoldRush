# Pacing Stop Condition

Status: active docs-only

Atom ID: 004-06
Parent packet: 004 - Zone Pressure Pacing Gap
Domain: battle royale/match/gameplay
Owner: n:gameplay:combat-pressure plus n:goldrush:final-rush-pressure

## Atomic Objective

Define stop rules for pressure that is too harsh, too weak, or not tied to player choice.

## Source Context

PUBG describes zone pressure as pacing movement, positioning, combat, survivor flow, and risk choices; GoldRush needs pressure to shape extraction decisions.

## Data Contract Seed

stop id, trigger metric, proof gap, required retune

## Event And Snapshot Seed

Event: pressurePacingStopRaised

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

audit packet stays open until pacing proof exists

## Research Pair

- research/004-06-pacing-stop-condition-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

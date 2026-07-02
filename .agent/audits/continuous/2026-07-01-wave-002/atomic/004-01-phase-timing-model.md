# Phase Timing Model

Status: active docs-only

Atom ID: 004-01
Parent packet: 004 - Zone Pressure Pacing Gap
Domain: battle royale/match/gameplay
Owner: n:gameplay:combat-pressure plus n:goldrush:final-rush-pressure

## Atomic Objective

Define early, mid, late, and final rush phases with movement and extraction timing intent.

## Source Context

PUBG describes zone pressure as pacing movement, positioning, combat, survivor flow, and risk choices; GoldRush needs pressure to shape extraction decisions.

## Data Contract Seed

phase id, warning time, pressure time, objective bias, density target

## Event And Snapshot Seed

Event: pressurePhaseAdvanced

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

simulator reports phase timings and target density

## Research Pair

- research/004-01-phase-timing-model-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

# Prop Anchor Density Gate

Status: active docs-only

Atom ID: 003-05
Parent packet: 003 - Massive Map POI Readability Gap
Domain: world/art/render
Owner: n:goldrush:desert-world-map plus n:render:terrain-bands

## Atomic Objective

Define how much clutter, cover, resource, and landmark density each POI can carry.

## Source Context

Apex emphasizes massive maps and PUBG emphasizes positional decisions; GoldRush needs authored POIs that read from player height.

## Data Contract Seed

anchor count, density tier, clutter cap, hero object count

## Event And Snapshot Seed

Event: poiAnchorDensityEvaluated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

density report prevents noise from replacing readability

## Research Pair

- research/003-05-prop-anchor-density-gate-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

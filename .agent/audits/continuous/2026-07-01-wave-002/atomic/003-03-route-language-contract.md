# Route Language Contract

Status: active docs-only

Atom ID: 003-03
Parent packet: 003 - Massive Map POI Readability Gap
Domain: world/art/render
Owner: n:goldrush:desert-world-map plus n:render:terrain-bands

## Atomic Objective

Define roads, rails, washes, ridges, and mine paths as authored navigation language.

## Source Context

Apex emphasizes massive maps and PUBG emphasizes positional decisions; GoldRush needs authored POIs that read from player height.

## Data Contract Seed

route id, surface class, travel role, risk tier, adjacent POIs

## Event And Snapshot Seed

Event: routeLanguageLoaded

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

route graph validates connected loop

## Research Pair

- research/003-03-route-language-contract-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

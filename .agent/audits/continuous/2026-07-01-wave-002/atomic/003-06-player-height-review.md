# Player Height Review

Status: active docs-only

Atom ID: 003-06
Parent packet: 003 - Massive Map POI Readability Gap
Domain: world/art/render
Owner: n:goldrush:desert-world-map plus n:render:terrain-bands

## Atomic Objective

Judge map identity from the third-person player camera, not only top-down debug views.

## Source Context

Apex emphasizes massive maps and PUBG emphasizes positional decisions; GoldRush needs authored POIs that read from player height.

## Data Contract Seed

camera pose, player point, POI visible tags, objective readability

## Event And Snapshot Seed

Event: playerHeightMapReviewed

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

browser screenshots capture normal gameplay view

## Research Pair

- research/003-06-player-height-review-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

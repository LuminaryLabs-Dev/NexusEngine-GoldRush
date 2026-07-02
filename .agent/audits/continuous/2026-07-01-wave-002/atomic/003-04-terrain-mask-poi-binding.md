# Terrain Mask Poi Binding

Status: active docs-only

Atom ID: 003-04
Parent packet: 003 - Massive Map POI Readability Gap
Domain: world/art/render
Owner: n:goldrush:desert-world-map plus n:render:terrain-bands

## Atomic Objective

Bind every POI to terrain masks so render, placement, and gameplay consume the same area.

## Source Context

Apex emphasizes massive maps and PUBG emphasizes positional decisions; GoldRush needs authored POIs that read from player height.

## Data Contract Seed

mask id, POI id, source revision, consumer list

## Event And Snapshot Seed

Event: poiMaskBound

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

mask validator finds no orphan POIs

## Research Pair

- research/003-04-terrain-mask-poi-binding-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

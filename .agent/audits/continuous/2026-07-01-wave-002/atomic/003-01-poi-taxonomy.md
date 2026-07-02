# Poi Taxonomy

Status: active docs-only

Atom ID: 003-01
Parent packet: 003 - Massive Map POI Readability Gap
Domain: world/art/render
Owner: n:goldrush:desert-world-map plus n:render:terrain-bands

## Atomic Objective

Define town, mine, rail, mountain, wash, gold seam, extraction, and combat POI classes.

## Source Context

Apex emphasizes massive maps and PUBG emphasizes positional decisions; GoldRush needs authored POIs that read from player height.

## Data Contract Seed

poi id, class, bounds, route links, landmark role

## Event And Snapshot Seed

Event: poiTaxonomyLoaded

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

schema validator rejects unclassified POIs

## Research Pair

- research/003-01-poi-taxonomy-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

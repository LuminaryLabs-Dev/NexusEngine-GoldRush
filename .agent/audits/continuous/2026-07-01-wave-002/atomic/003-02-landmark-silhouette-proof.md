# Landmark Silhouette Proof

Status: active docs-only

Atom ID: 003-02
Parent packet: 003 - Massive Map POI Readability Gap
Domain: world/art/render
Owner: n:goldrush:desert-world-map plus n:render:terrain-bands

## Atomic Objective

Require each major POI to have a readable silhouette from near, mid, and far distances.

## Source Context

Apex emphasizes massive maps and PUBG emphasizes positional decisions; GoldRush needs authored POIs that read from player height.

## Data Contract Seed

landmark id, silhouette role, view distance, screenshot anchor

## Event And Snapshot Seed

Event: landmarkProofCaptured

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

human-view screenshot set covers three distances

## Research Pair

- research/003-02-landmark-silhouette-proof-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

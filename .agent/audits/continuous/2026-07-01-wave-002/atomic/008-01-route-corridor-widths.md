# Route Corridor Widths

Status: active docs-only

Atom ID: 008-01
Parent packet: 008 - Rotation And Encounter Distance Gap
Domain: world/control/combat
Owner: n:goldrush:desert-world-map plus n:goldrush:combat-route-guidance

## Atomic Objective

Define route corridor width, cover cadence, slope limits, and sightline length.

## Source Context

PUBG pacing depends on rotations and encounter distances; GoldRush needs routes and cover that work with over-shoulder movement and combat.

## Data Contract Seed

route id, width, slope, cover cadence, sightline band

## Event And Snapshot Seed

Event: routeCorridorMeasured

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

validator flags impossible traversal corridors

## Research Pair

- research/008-01-route-corridor-widths-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

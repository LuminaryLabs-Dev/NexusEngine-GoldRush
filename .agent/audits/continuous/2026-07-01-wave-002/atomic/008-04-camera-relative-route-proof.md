# Camera Relative Route Proof

Status: active docs-only

Atom ID: 008-04
Parent packet: 008 - Rotation And Encounter Distance Gap
Domain: world/control/combat
Owner: n:goldrush:desert-world-map plus n:goldrush:combat-route-guidance

## Atomic Objective

Prove WASD follows camera look while traversing authored routes and slopes.

## Source Context

PUBG pacing depends on rotations and encounter distances; GoldRush needs routes and cover that work with over-shoulder movement and combat.

## Data Contract Seed

camera yaw, input vector, route leg, slope state, movement result

## Event And Snapshot Seed

Event: cameraRelativeRouteSampled

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

Playwright route proof uses mouse look and WASD

## Research Pair

- research/008-04-camera-relative-route-proof-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

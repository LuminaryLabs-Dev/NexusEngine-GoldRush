# Encounter Distance Bands

Status: active docs-only

Atom ID: 008-02
Parent packet: 008 - Rotation And Encounter Distance Gap
Domain: world/control/combat
Owner: n:goldrush:desert-world-map plus n:goldrush:combat-route-guidance

## Atomic Objective

Define near, mid, and long engagement distance bands for western weapons and cover.

## Source Context

PUBG pacing depends on rotations and encounter distances; GoldRush needs routes and cover that work with over-shoulder movement and combat.

## Data Contract Seed

band id, distance range, weapon role, cover need, camera mode

## Event And Snapshot Seed

Event: encounterBandLoaded

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

combat proof records engagement band

## Research Pair

- research/008-02-encounter-distance-bands-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

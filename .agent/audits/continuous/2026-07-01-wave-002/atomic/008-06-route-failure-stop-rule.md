# Route Failure Stop Rule

Status: active docs-only

Atom ID: 008-06
Parent packet: 008 - Rotation And Encounter Distance Gap
Domain: world/control/combat
Owner: n:goldrush:desert-world-map plus n:goldrush:combat-route-guidance

## Atomic Objective

Define stop conditions for blocked routes, unreadable paths, or camera fights.

## Source Context

PUBG pacing depends on rotations and encounter distances; GoldRush needs routes and cover that work with over-shoulder movement and combat.

## Data Contract Seed

failure id, route id, evidence, required owner

## Event And Snapshot Seed

Event: routeStopRaised

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

audit stays open until route proof passes

## Research Pair

- research/008-06-route-failure-stop-rule-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

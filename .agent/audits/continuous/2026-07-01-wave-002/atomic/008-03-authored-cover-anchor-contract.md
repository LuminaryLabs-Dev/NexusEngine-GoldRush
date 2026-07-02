# Authored Cover Anchor Contract

Status: active docs-only

Atom ID: 008-03
Parent packet: 008 - Rotation And Encounter Distance Gap
Domain: world/control/combat
Owner: n:goldrush:desert-world-map plus n:goldrush:combat-route-guidance

## Atomic Objective

Move combat cover from player-relative fallback toward authored terrain anchors.

## Source Context

PUBG pacing depends on rotations and encounter distances; GoldRush needs routes and cover that work with over-shoulder movement and combat.

## Data Contract Seed

cover id, anchor id, normal, height, route link, flank risk

## Event And Snapshot Seed

Event: coverAnchorActivated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

validator rejects cover without source anchor

## Research Pair

- research/008-03-authored-cover-anchor-contract-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

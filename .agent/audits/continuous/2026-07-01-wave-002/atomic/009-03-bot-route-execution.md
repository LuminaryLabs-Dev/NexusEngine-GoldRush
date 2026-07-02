# Bot Route Execution

Status: active docs-only

Atom ID: 009-03
Parent packet: 009 - Staging And Bot Proof Gap
Domain: staging/validation/network
Owner: n:goldrush:single-player-staging plus n:runtime:validation

## Atomic Objective

Make bots traverse authored routes and interact with mining/extraction systems.

## Source Context

A 60-player target needs staging proof when live players are not available; bot behavior must exercise the game loop rather than stand still.

## Data Contract Seed

bot id, route leg, target, action state, receipt output

## Event And Snapshot Seed

Event: botRouteAdvanced

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

simulator records bot loop receipts

## Research Pair

- research/009-03-bot-route-execution-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

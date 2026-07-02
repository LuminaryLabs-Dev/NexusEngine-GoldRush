# Scale Ramp Schedule

Status: active docs-only

Atom ID: 009-05
Parent packet: 009 - Staging And Bot Proof Gap
Domain: staging/validation/network
Owner: n:goldrush:single-player-staging plus n:runtime:validation

## Atomic Objective

Define 4, 12, 20, 40, and 60 participant staging milestones.

## Source Context

A 60-player target needs staging proof when live players are not available; bot behavior must exercise the game loop rather than stand still.

## Data Contract Seed

milestone id, bot count, proof target, budget target, caveat

## Event And Snapshot Seed

Event: scaleMilestoneEvaluated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

milestones fail closed when budgets break

## Research Pair

- research/009-05-scale-ramp-schedule-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

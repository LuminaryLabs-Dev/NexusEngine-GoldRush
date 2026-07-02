# Single Player Staging Entry

Status: active docs-only

Atom ID: 009-02
Parent packet: 009 - Staging And Bot Proof Gap
Domain: staging/validation/network
Owner: n:goldrush:single-player-staging plus n:runtime:validation

## Atomic Objective

Add a proof-only single-player staging mode that does not leak into normal player UX.

## Source Context

A 60-player target needs staging proof when live players are not available; bot behavior must exercise the game loop rather than stand still.

## Data Contract Seed

mode id, enabled flag, bot count, proof label, entry point

## Event And Snapshot Seed

Event: stagingModeEntered

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

public proof labels staging mode

## Research Pair

- research/009-02-single-player-staging-entry-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

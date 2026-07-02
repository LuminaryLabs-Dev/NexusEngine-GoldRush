# Bot Combat Pressure

Status: active docs-only

Atom ID: 009-04
Parent packet: 009 - Staging And Bot Proof Gap
Domain: staging/validation/network
Owner: n:goldrush:single-player-staging plus n:runtime:validation

## Atomic Objective

Make bots trigger readable pressure and cover behavior without requiring real peers.

## Source Context

A 60-player target needs staging proof when live players are not available; bot behavior must exercise the game loop rather than stand still.

## Data Contract Seed

bot id, threat role, cover target, shot event, pressure receipt

## Event And Snapshot Seed

Event: botThreatExecuted

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

combat readiness matrix consumes bot events

## Research Pair

- research/009-04-bot-combat-pressure-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

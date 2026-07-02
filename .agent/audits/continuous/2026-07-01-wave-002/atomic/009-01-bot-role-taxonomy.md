# Bot Role Taxonomy

Status: active docs-only

Atom ID: 009-01
Parent packet: 009 - Staging And Bot Proof Gap
Domain: staging/validation/network
Owner: n:goldrush:single-player-staging plus n:runtime:validation

## Atomic Objective

Define miner, carrier, ambusher, extractor, scout, and late-rotator bot roles.

## Source Context

A 60-player target needs staging proof when live players are not available; bot behavior must exercise the game loop rather than stand still.

## Data Contract Seed

bot role, objective, route policy, combat policy, extraction policy

## Event And Snapshot Seed

Event: botRoleRegistered

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

staging validator sees all roles

## Research Pair

- research/009-01-bot-role-taxonomy-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

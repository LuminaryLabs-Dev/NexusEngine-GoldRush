# Semantic Cue Taxonomy

Status: active docs-only

Atom ID: 006-01
Parent packet: 006 - Audio As World Information Gap
Domain: audio/presentation/gameplay
Owner: n:audio:cue-state plus n:goldrush:music-and-stingers

## Atomic Objective

Define semantic audio cue roles for the full loop.

## Source Context

Hunt treats world sound as information; GoldRush needs train, gold, cargo, threat, shots, cashout, and results to be readable through audio.

## Data Contract Seed

cue id, semantic role, source kit, fallback pattern, approval slot

## Event And Snapshot Seed

Event: audioCueRoleRegistered

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

cue validator covers title through results

## Research Pair

- research/006-01-semantic-cue-taxonomy-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

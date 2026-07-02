# Approval Promotion Bridge

Status: active docs-only

Atom ID: 006-04
Parent packet: 006 - Audio As World Information Gap
Domain: audio/presentation/gameplay
Owner: n:audio:cue-state plus n:goldrush:music-and-stingers

## Atomic Objective

Keep actual audio behind approval while preserving cue slots.

## Source Context

Hunt treats world sound as information; GoldRush needs train, gold, cargo, threat, shots, cashout, and results to be readable through audio.

## Data Contract Seed

candidate id, approval state, runtime path allowed, fallback cue

## Event And Snapshot Seed

Event: audioApprovalStateRead

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

validator proves no raw runtime promotion

## Research Pair

- research/006-04-approval-promotion-bridge-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

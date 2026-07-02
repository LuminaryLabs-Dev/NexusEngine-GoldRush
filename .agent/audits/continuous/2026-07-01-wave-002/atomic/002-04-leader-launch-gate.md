# Leader Launch Gate

Status: active docs-only

Atom ID: 002-04
Parent packet: 002 - Squad Identity And Lobby Gap
Domain: UX/network/presentation
Owner: n:network:party-room plus n:goldrush:party-lobby

## Atomic Objective

Define exactly when the party leader can launch the loading-yard sequence.

## Source Context

Apex foregrounds playable identity, modes, and squad readiness; GoldRush needs a lobby that reads as party staging, not infrastructure control.

## Data Contract Seed

leader flag, member readiness, selected group type, launch payload

## Event And Snapshot Seed

Event: partyLaunchRequested

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

nonleader launch attempt is rejected

## Research Pair

- research/002-04-leader-launch-gate-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

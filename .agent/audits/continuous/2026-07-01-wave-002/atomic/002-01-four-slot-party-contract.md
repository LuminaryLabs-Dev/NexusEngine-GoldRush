# Four Slot Party Contract

Status: active docs-only

Atom ID: 002-01
Parent packet: 002 - Squad Identity And Lobby Gap
Domain: UX/network/presentation
Owner: n:network:party-room plus n:goldrush:party-lobby

## Atomic Objective

Lock party lobby proof around up to four visible party slots and a clear leader state.

## Source Context

Apex foregrounds playable identity, modes, and squad readiness; GoldRush needs a lobby that reads as party staging, not infrastructure control.

## Data Contract Seed

party code, leader id, member slots, ready flags, launch authority

## Event And Snapshot Seed

Event: partySlotsUpdated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

two-tab proof shows roster and leader action

## Research Pair

- research/002-01-four-slot-party-contract-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

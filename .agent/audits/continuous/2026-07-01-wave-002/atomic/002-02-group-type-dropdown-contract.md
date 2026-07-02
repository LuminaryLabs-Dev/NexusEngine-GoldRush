# Group Type Dropdown Contract

Status: active docs-only

Atom ID: 002-02
Parent packet: 002 - Squad Identity And Lobby Gap
Domain: UX/network/presentation
Owner: n:network:party-room plus n:goldrush:party-lobby

## Atomic Objective

Keep Crew, Posse, and Outfit as a compact dropdown that affects launch payload without turning into hero cards.

## Source Context

Apex foregrounds playable identity, modes, and squad readiness; GoldRush needs a lobby that reads as party staging, not infrastructure control.

## Data Contract Seed

group type, size expectation, mode copy, payload key

## Event And Snapshot Seed

Event: partyGroupTypeSelected

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

DOM proof shows dropdown and no card-grid regression

## Research Pair

- research/002-02-group-type-dropdown-contract-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

# Character Preview Ownership

Status: active docs-only

Atom ID: 002-03
Parent packet: 002 - Squad Identity And Lobby Gap
Domain: UX/network/presentation
Owner: n:network:party-room plus n:goldrush:party-lobby

## Atomic Objective

Make the 3D lobby character preview a render consumer with its own drag-spin proof.

## Source Context

Apex foregrounds playable identity, modes, and squad readiness; GoldRush needs a lobby that reads as party staging, not infrastructure control.

## Data Contract Seed

character asset id, pedestal state, rotation, preview readiness

## Event And Snapshot Seed

Event: characterPreviewRotated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

Playwright drag proof changes preview yaw

## Research Pair

- research/002-03-character-preview-ownership-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

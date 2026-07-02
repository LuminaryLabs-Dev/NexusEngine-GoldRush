# First Viewport Ux Gate

Status: active docs-only

Atom ID: 002-06
Parent packet: 002 - Squad Identity And Lobby Gap
Domain: UX/network/presentation
Owner: n:network:party-room plus n:goldrush:party-lobby

## Atomic Objective

Ensure only hero controls appear first-screen while advanced/debug controls stay folded.

## Source Context

Apex foregrounds playable identity, modes, and squad readiness; GoldRush needs a lobby that reads as party staging, not infrastructure control.

## Data Contract Seed

hero control ids, advanced group ids, foldout state, viewport result

## Event And Snapshot Seed

Event: lobbyUxGateEvaluated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

browser proof checks first viewport hierarchy

## Research Pair

- research/002-06-first-viewport-ux-gate-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

# Lobby Audio And Feedback

Status: active docs-only

Atom ID: 002-05
Parent packet: 002 - Squad Identity And Lobby Gap
Domain: UX/network/presentation
Owner: n:network:party-room plus n:goldrush:party-lobby

## Atomic Objective

Define lobby feedback cues that avoid humming and keep party state readable.

## Source Context

Apex foregrounds playable identity, modes, and squad readiness; GoldRush needs a lobby that reads as party staging, not infrastructure control.

## Data Contract Seed

cue id, fallback pattern, ready cue, launch cue, error cue

## Event And Snapshot Seed

Event: lobbyCuePlayed

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

audio manager reports short cue patterns only

## Research Pair

- research/002-05-lobby-audio-and-feedback-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

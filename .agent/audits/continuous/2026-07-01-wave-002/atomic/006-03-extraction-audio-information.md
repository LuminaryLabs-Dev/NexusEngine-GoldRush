# Extraction Audio Information

Status: active docs-only

Atom ID: 006-03
Parent packet: 006 - Audio As World Information Gap
Domain: audio/presentation/gameplay
Owner: n:audio:cue-state plus n:goldrush:music-and-stingers

## Atomic Objective

Make cashout progress, contest, success, and interruption audible.

## Source Context

Hunt treats world sound as information; GoldRush needs train, gold, cargo, threat, shots, cashout, and results to be readable through audio.

## Data Contract Seed

zone id, progress cue, contest cue, success cue, interrupt cue

## Event And Snapshot Seed

Event: extractionAudioCuePlayed

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

proof aligns cue timing with receipt state

## Research Pair

- research/006-03-extraction-audio-information-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

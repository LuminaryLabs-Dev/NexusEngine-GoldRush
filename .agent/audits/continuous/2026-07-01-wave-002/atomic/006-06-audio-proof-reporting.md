# Audio Proof Reporting

Status: active docs-only

Atom ID: 006-06
Parent packet: 006 - Audio As World Information Gap
Domain: audio/presentation/gameplay
Owner: n:audio:cue-state plus n:goldrush:music-and-stingers

## Atomic Objective

Make retained proof include cue facts without storing sensitive paths.

## Source Context

Hunt treats world sound as information; GoldRush needs train, gold, cargo, threat, shots, cashout, and results to be readable through audio.

## Data Contract Seed

cue ids, scenario, source kit, timing, sanitized labels

## Event And Snapshot Seed

Event: audioProofReported

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

report-secret validation passes

## Research Pair

- research/006-06-audio-proof-reporting-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

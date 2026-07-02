# Mix And Fatigue Policy

Status: active docs-only

Atom ID: 006-05
Parent packet: 006 - Audio As World Information Gap
Domain: audio/presentation/gameplay
Owner: n:audio:cue-state plus n:goldrush:music-and-stingers

## Atomic Objective

Prevent fallback audio from becoming humming, noisy, or fatiguing.

## Source Context

Hunt treats world sound as information; GoldRush needs train, gold, cargo, threat, shots, cashout, and results to be readable through audio.

## Data Contract Seed

loop flag, duration, repetition cap, priority, cooldown

## Event And Snapshot Seed

Event: audioFatigueGateEvaluated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

audio manager rejects sustained fallback beds

## Research Pair

- research/006-05-mix-and-fatigue-policy-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

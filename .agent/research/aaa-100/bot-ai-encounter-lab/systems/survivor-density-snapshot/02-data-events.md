# Survivor Density Snapshot Data And Events

Status: planned

## Minimal Data

- `humanRemaining`
- `botRemaining`
- `squadRemaining`
- `regionDensity`
- `proofTier`

## Events

- `density.sampled`
- `density.warning`
- `density.proof-labeled`

## Event Rules

- Events are facts, not commands.
- Every event includes mode id and proof tier when used in staging.
- Bot events must include bot/human classification when they can reach match receipts.
- Renderer events may consume state but cannot invent behavior.

## Snapshot Rules

- Snapshot must be JSON serializable.
- Snapshot must reset cleanly between title, lobby, loading-yard, gold-field, and results runs.
- Snapshot must avoid local machine details and browser profile details.

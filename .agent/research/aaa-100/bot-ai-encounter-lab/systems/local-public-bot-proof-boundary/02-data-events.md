# Local Public Bot Proof Boundary Data And Events

Status: planned

## Minimal Data

- `proofType`
- `allowedClaims`
- `blockedClaims`
- `releaseGate`

## Events

- `proof.boundary.classified`
- `proof.overclaim.rejected`
- `proof.release-gate.updated`

## Event Rules

- Events are facts, not commands.
- Every event includes mode id and proof tier when used in staging.
- Bot events must include bot/human classification when they can reach match receipts.
- Renderer events may consume state but cannot invent behavior.

## Snapshot Rules

- Snapshot must be JSON serializable.
- Snapshot must reset cleanly between title, lobby, loading-yard, gold-field, and results runs.
- Snapshot must avoid local machine details and browser profile details.

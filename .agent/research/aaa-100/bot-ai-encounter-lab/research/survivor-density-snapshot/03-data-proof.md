# Survivor Density Snapshot Data Proof

Status: planned

## Data Seed

- `humanRemaining`
- `botRemaining`
- `squadRemaining`
- `regionDensity`
- `proofTier`

## Event Seed

- `density.sampled`
- `density.warning`
- `density.proof-labeled`

## Proof Seed

- Validator: `validate-survivor-density-snapshot.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Reports distinguish visible player-facing info from hidden director-only density and label simulated bodies clearly.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

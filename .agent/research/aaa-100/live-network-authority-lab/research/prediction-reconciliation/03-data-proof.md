# Prediction Reconciliation Data Proof

Status: planned

## Data Seed

- `predictionTick`
- `authorityTick`
- `positionError`
- `smoothedError`
- `pulsingFlag`

## Event Seed

- `prediction.stepped`
- `authority.correction.applied`
- `reconciliation.pulsing.detected`

## Proof Seed

- Validator: `validate-prediction-reconciliation.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Motion samples show correction without every-other-frame camera or character snapback.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

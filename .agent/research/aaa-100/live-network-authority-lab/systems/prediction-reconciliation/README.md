# 11 Prediction Reconciliation

Status: planned

## Purpose

Predict local movement and reconcile to authoritative snapshots without camera or player pulsing.

## Player Need

The player should move smoothly even when remote state is delayed.

## Owning Kits

- Generic incubator candidate: `n:network:prediction-reconciliation`
- GoldRush custom kit: `n:goldrush:prediction-reconciliation`

## Public API Seed

- `predictLocal(dt)`
- `applyAuthorityCorrection(snapshot)`
- `getReconciliationState()`

## Internal API Seed

- `comparePredictedToAuthority(local, remote)`
- `smoothCorrection(error)`
- `detectCorrectionPulsing(samples)`

## Events

- `prediction.stepped`
- `authority.correction.applied`
- `reconciliation.pulsing.detected`

## Snapshot

- `predictionTick`
- `authorityTick`
- `positionError`
- `smoothedError`
- `pulsingFlag`

## Validator

`validate-prediction-reconciliation.mjs`

## Player-View Proof

Motion samples show correction without every-other-frame camera or character snapback.

## Risk If Missing

Bad reconciliation will reintroduce the exact camera/player pulsing the project already had to clean up.

# 15 Survivor Density Snapshot

Status: planned

## Purpose

Track remaining humans, bots, squads, and nearby pressure without claiming full live authority.

## Player Need

The match should communicate remaining pressure and avoid dead zones.

## Owning Kits

- Generic incubator candidate: `n:ai:density-snapshot`
- GoldRush custom kit: `n:goldrush:survivor-density`

## Public API Seed

- `getDensitySnapshot()`
- `sampleNearbyDensity(position)`
- `labelProofTier()`

## Internal API Seed

- `bucketPlayersByRegion(roster)`
- `estimateEncounterLikelihood(region)`
- `redactUnfairKnowledge(snapshot)`

## Events

- `density.sampled`
- `density.warning`
- `density.proof-labeled`

## Snapshot

- `humanRemaining`
- `botRemaining`
- `squadRemaining`
- `regionDensity`
- `proofTier`

## Validator

`validate-survivor-density-snapshot.mjs`

## Player-View Proof

Reports distinguish visible player-facing info from hidden director-only density and label simulated bodies clearly.

## Risk If Missing

Density without proof labels becomes misleading scale marketing or unfair wallhack-like UI.

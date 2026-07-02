# 14 Encounter Distance Bands

Status: planned

## Purpose

Control encounter distances so threats are readable at frontier scale.

## Player Need

The player should see near, mid, and far danger in a way the camera can parse.

## Owning Kits

- Generic incubator candidate: `n:ai:encounter-director`
- GoldRush custom kit: `n:goldrush:encounter-distance-bands`

## Public API Seed

- `classifyDistance(distance)`
- `getBandPolicy(modeId)`
- `assignEncounterBand(context)`

## Internal API Seed

- `sampleBandFromTerrain(context)`
- `avoidBlindSpawnBand(context)`
- `normalizeBandWeights(weights)`

## Events

- `encounter.band.selected`
- `encounter.band.rejected`
- `encounter.band.resolved`

## Snapshot

- `bandId`
- `minRange`
- `maxRange`
- `cameraRequirement`
- `readabilityRisk`

## Validator

`validate-encounter-distance-bands.mjs`

## Player-View Proof

Proof samples encounter bands from over-shoulder camera and fails blind close spawns or invisible far threats.

## Risk If Missing

Bad distance bands cause jumpscares, unreadable hits, or empty wide terrain.

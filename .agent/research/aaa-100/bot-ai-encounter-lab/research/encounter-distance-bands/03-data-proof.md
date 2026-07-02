# Encounter Distance Bands Data Proof

Status: planned

## Data Seed

- `bandId`
- `minRange`
- `maxRange`
- `cameraRequirement`
- `readabilityRisk`

## Event Seed

- `encounter.band.selected`
- `encounter.band.rejected`
- `encounter.band.resolved`

## Proof Seed

- Validator: `validate-encounter-distance-bands.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Proof samples encounter bands from over-shoulder camera and fails blind close spawns or invisible far threats.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

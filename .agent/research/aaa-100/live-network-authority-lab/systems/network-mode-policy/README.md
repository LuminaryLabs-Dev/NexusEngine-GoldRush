# 01 Network Mode Policy

Status: planned

## Purpose

Separate local, public proof, bot staging, simulated scale, peer party, and future live 60-player modes.

## Player Need

The player and developer should know whether a run is solo, bot-filled, peer-party, simulated, or live.

## Owning Kits

- Generic incubator candidate: `n:network:mode-policy`
- GoldRush custom kit: `n:goldrush:network-mode-policy`

## Public API Seed

- `getNetworkMode()`
- `setNetworkMode(modeId)`
- `classifyRun(runSnapshot)`

## Internal API Seed

- `deriveAllowedClaims(mode)`
- `applyRewardEligibility(mode)`
- `rejectModeOverclaim(report)`

## Events

- `network.mode.selected`
- `network.mode.claims.changed`
- `network.mode.overclaim.rejected`

## Snapshot

- `modeId`
- `proofTier`
- `humanCount`
- `botCount`
- `liveEligible`
- `allowedClaims`

## Validator

`validate-network-mode-policy.mjs`

## Player-View Proof

Reports and UI label local, public, simulated, peer-party, and future live runs without ambiguity.

## Risk If Missing

Without mode policy, single-browser or bot proof will keep being mistaken for live 60-player readiness.

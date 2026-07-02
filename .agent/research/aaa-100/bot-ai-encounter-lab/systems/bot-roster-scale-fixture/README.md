# 02 Bot Roster Scale Fixture

Status: planned

## Purpose

Create deterministic bot rosters for solo, 20-player, and 60-player staged runs.

## Player Need

A solo tester should see a full-feeling match without the UI claiming it is live multiplayer.

## Owning Kits

- Generic incubator candidate: `n:ai:bot-roster`
- GoldRush custom kit: `n:goldrush:staging-bot-roster`

## Public API Seed

- `createRoster(modeId, seed)`
- `getRosterSnapshot()`
- `setHumanCount(count)`

## Internal API Seed

- `allocateBotSquads(targetCount)`
- `balanceRoleWeights(roster)`
- `applyModeEligibility(roster)`

## Events

- `bot.roster.created`
- `bot.roster.filled`
- `bot.roster.mode-labeled`

## Snapshot

- `modeId`
- `humanCount`
- `botCount`
- `squadCount`
- `proofLabel`

## Validator

`validate-bot-roster-scale-fixture.mjs`

## Player-View Proof

Roster proof distinguishes solo staging, 20 simulated bodies, 60 simulated bodies, and future live human count.

## Risk If Missing

If roster proof is ambiguous, the project will overclaim 60-player readiness from one-browser staging.

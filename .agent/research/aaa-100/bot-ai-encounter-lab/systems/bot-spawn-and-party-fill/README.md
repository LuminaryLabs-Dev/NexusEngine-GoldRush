# 03 Bot Spawn And Party Fill

Status: planned

## Purpose

Fill non-human slots and place bots into fair spawn bands without joining the player party.

## Player Need

Party members should remain human-controlled, while bots fill the wider match as readable opponents.

## Owning Kits

- Generic incubator candidate: `n:ai:spawn-fill`
- GoldRush custom kit: `n:goldrush:bot-party-fill`

## Public API Seed

- `assignFill(modeId, partySnapshot)`
- `getSpawnPlan()`
- `reserveSpawn(roleId)`

## Internal API Seed

- `scoreSpawnSafety(point)`
- `avoidPlayerSpawnBubble(points)`
- `distributeSquadsAcrossPOIs(points)`

## Events

- `bot.fill.applied`
- `bot.spawn.reserved`
- `bot.spawn.rejected`

## Snapshot

- `partySize`
- `fillPolicy`
- `spawnBands`
- `reservedSpawns`

## Validator

`validate-bot-spawn-party-fill.mjs`

## Player-View Proof

Spawn plan keeps bots out of the party, avoids instant spawn killing, and covers mine/town/cashout regions.

## Risk If Missing

Bad spawn fill makes staging unfair or makes all combat arrive from behind the player.

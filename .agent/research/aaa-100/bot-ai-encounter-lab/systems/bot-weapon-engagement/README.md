# 11 Bot Weapon Engagement

Status: planned

## Purpose

Define staged weapon engagement with aim, miss, hit, reload, and disengage timings.

## Player Need

A revolver or rifle encounter should be readable and dramatic instead of instant receipt math.

## Owning Kits

- Generic incubator candidate: `n:ai:combat-agent`
- GoldRush custom kit: `n:goldrush:bot-western-combat`

## Public API Seed

- `startEngagement(botId, targetId)`
- `getEngagement(botId)`
- `forceDisengage(botId)`

## Internal API Seed

- `sampleAccuracy(context)`
- `scheduleReload(botState)`
- `emitShotReceipt(botId, targetId)`

## Events

- `bot.weapon.aimed`
- `bot.weapon.fired`
- `bot.weapon.reloaded`
- `bot.weapon.hit`

## Snapshot

- `weaponId`
- `aimTime`
- `accuracyBand`
- `reloadState`
- `lastShot`

## Validator

`validate-bot-weapon-engagement.mjs`

## Player-View Proof

Combat proof includes miss windows, reload windows, hit receipts, readable muzzle/audio cue state, and damage labels.

## Risk If Missing

If weapon behavior is just hit receipts, combat will not reach AAA feel.

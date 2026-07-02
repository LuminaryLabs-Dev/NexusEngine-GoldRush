# 09 Bot Threat Telegraph

Status: planned

## Purpose

Expose readable threat cues before a bot attacks or ambushes.

## Player Need

The player needs a fair warning through sightline, sound, posture, or dust before damage arrives.

## Owning Kits

- Generic incubator candidate: `n:ai:combat-agent`
- GoldRush custom kit: `n:goldrush:bot-threat-telegraph`

## Public API Seed

- `armThreat(botId, targetId)`
- `getThreatCue(botId)`
- `cancelThreat(botId)`

## Internal API Seed

- `scoreLineOfSight(botId, targetId)`
- `chooseTelegraphStyle(context)`
- `gateDamageUntilCue(cueState)`

## Events

- `bot.threat.armed`
- `bot.threat.telegraphed`
- `bot.threat.committed`

## Snapshot

- `botId`
- `targetId`
- `cueType`
- `cueDuration`
- `damageGate`

## Validator

`validate-bot-threat-telegraph.mjs`

## Player-View Proof

Threats cannot damage before a minimum readable cue window and cue source is logged for screenshots.

## Risk If Missing

Unreadable bot attacks will make combat feel unfair even if receipts are correct.

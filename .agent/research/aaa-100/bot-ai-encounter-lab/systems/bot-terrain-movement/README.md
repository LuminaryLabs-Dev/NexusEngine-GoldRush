# 05 Bot Terrain Movement

Status: planned

## Purpose

Move bots over the same terrain/raycast/collider rules used by the local player.

## Player Need

Opponents should stand on terrain, respect slopes, and move through paths that look physically possible.

## Owning Kits

- Generic incubator candidate: `n:ai:movement-agent`
- GoldRush custom kit: `n:goldrush:bot-terrain-movement`

## Public API Seed

- `stepBotMovement(botId, dt)`
- `getMovementSnapshot(botId)`
- `pauseBot(botId)`

## Internal API Seed

- `sampleGround(point)`
- `resolveSlopeLimit(state)`
- `smoothVelocity(state, target)`

## Events

- `bot.move.stepped`
- `bot.ground.matched`
- `bot.route.failed`

## Snapshot

- `position`
- `velocity`
- `grounded`
- `slope`
- `groundMismatch`

## Validator

`validate-bot-terrain-movement.mjs`

## Player-View Proof

Movement proof samples many bots and fails when they float, sink, or cross invalid blockers.

## Risk If Missing

If bots use simpler movement than players, staging will miss terrain/collider regressions.

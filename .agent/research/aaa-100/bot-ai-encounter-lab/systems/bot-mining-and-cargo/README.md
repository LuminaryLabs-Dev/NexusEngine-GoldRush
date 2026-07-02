# 07 Bot Mining And Cargo

Status: planned

## Purpose

Exercise mine, carry, drop, and loss behaviors with bot-owned cargo receipts.

## Player Need

Bots should visibly extract value from the world and become targets because they carry gold.

## Owning Kits

- Generic incubator candidate: `n:ai:objective-agent`
- GoldRush custom kit: `n:goldrush:bot-cargo-runner`

## Public API Seed

- `startBotMine(botId, resourceId)`
- `getCargo(botId)`
- `dropCargo(botId, reason)`

## Internal API Seed

- `applyCargoWeight(botState)`
- `emitCargoReceipt(botId, amount)`
- `chooseDropPoint(botState)`

## Events

- `bot.mine.started`
- `bot.cargo.added`
- `bot.cargo.dropped`

## Snapshot

- `carriedGold`
- `capacity`
- `weightPenalty`
- `dropEligible`

## Validator

`validate-bot-mining-cargo.mjs`

## Player-View Proof

Bot cargo changes movement, threat value, score receipts, and visible dropped-gold opportunities.

## Risk If Missing

If bots do not carry value, combat becomes detached from extraction stakes.

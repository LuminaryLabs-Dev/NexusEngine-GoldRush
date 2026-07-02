# 08 Bot Cashout Objective

Status: planned

## Purpose

Make bots attempt extraction so cashout sites become contested objectives.

## Player Need

Cashout should feel like a race and a fight, not only a private end button.

## Owning Kits

- Generic incubator candidate: `n:ai:objective-agent`
- GoldRush custom kit: `n:goldrush:bot-cashout-runner`

## Public API Seed

- `assignCashout(botId, siteId)`
- `getCashoutIntent(botId)`
- `resolveBotDeposit(botId)`

## Internal API Seed

- `scoreCashoutRisk(site)`
- `waitForHoldWindow(botState)`
- `interruptCashout(botId, source)`

## Events

- `bot.cashout.assigned`
- `bot.cashout.started`
- `bot.cashout.completed`
- `bot.cashout.interrupted`

## Snapshot

- `siteId`
- `holdProgress`
- `contestState`
- `depositedGold`

## Validator

`validate-bot-cashout-objective.mjs`

## Player-View Proof

Bots reach cashout sites, start holds, get interrupted, and write labeled bot extraction receipts.

## Risk If Missing

Without cashout bots, extraction sites cannot test contested landmark readability.

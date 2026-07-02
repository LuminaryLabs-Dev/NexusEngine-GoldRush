# 12 Bot Downed Revive Recovery

Status: planned

## Purpose

Handle bot downed, revive, flee, and recovery states without blocking solo staging.

## Player Need

Squad-like fights should have readable finishes and recovery, while solo staging should not get stuck.

## Owning Kits

- Generic incubator candidate: `n:ai:recovery-agent`
- GoldRush custom kit: `n:goldrush:bot-recovery`

## Public API Seed

- `downBot(botId)`
- `reviveBot(botId, sourceId)`
- `recoverBot(botId)`

## Internal API Seed

- `chooseRecoveryPolicy(modeId)`
- `timeReviveWindow(botState)`
- `expireDownedState(botId)`

## Events

- `bot.downed`
- `bot.revive.started`
- `bot.revived`
- `bot.eliminated`

## Snapshot

- `downedState`
- `reviveEligible`
- `reviveTimer`
- `eliminationReason`

## Validator

`validate-bot-recovery.mjs`

## Player-View Proof

Solo staging cannot deadlock on revive rules, while squad-like bot fights can show recovery windows.

## Risk If Missing

Recovery rules can make staging unwinnable or hide team-combat bugs.

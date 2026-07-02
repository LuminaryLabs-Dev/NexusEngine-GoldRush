# 10 Bot Cover And Peek

Status: planned

## Purpose

Make bots use cover, peek windows, and retreat routes tied to authored cover descriptors.

## Player Need

Combat should have positions, timing, and counterplay rather than open-field trading.

## Owning Kits

- Generic incubator candidate: `n:ai:combat-agent`
- GoldRush custom kit: `n:goldrush:bot-cover-counterplay`

## Public API Seed

- `assignCover(botId, coverId)`
- `peek(botId)`
- `retreat(botId)`

## Internal API Seed

- `scoreCoverQuality(cover)`
- `timePeekWindow(botState)`
- `avoidInvalidCover(coverId)`

## Events

- `bot.cover.claimed`
- `bot.cover.peeked`
- `bot.cover.left`

## Snapshot

- `coverId`
- `coverQuality`
- `peekWindowMs`
- `retreatTarget`

## Validator

`validate-bot-cover-peek.mjs`

## Player-View Proof

Bots pick valid cover, expose readable peeks, and do not shoot from blocked or impossible positions.

## Risk If Missing

Without cover behavior, future weapon kits will hide map and encounter layout problems.

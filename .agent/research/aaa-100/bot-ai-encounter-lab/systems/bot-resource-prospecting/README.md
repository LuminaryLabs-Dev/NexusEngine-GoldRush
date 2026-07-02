# 06 Bot Resource Prospecting

Status: planned

## Purpose

Let bots seek gold sources so the player sees competition around resource areas.

## Player Need

Gold seams should attract visible traffic and create risk/reward decisions.

## Owning Kits

- Generic incubator candidate: `n:ai:objective-agent`
- GoldRush custom kit: `n:goldrush:bot-prospecting`

## Public API Seed

- `assignProspecting(botId, resourceId)`
- `getProspectingState(botId)`
- `cancelProspecting(botId)`

## Internal API Seed

- `scoreResourceValue(resource)`
- `selectNearbyClaim(botId)`
- `throttleCrowdedResource(resourceId)`

## Events

- `bot.prospecting.assigned`
- `bot.prospecting.started`
- `bot.prospecting.abandoned`

## Snapshot

- `botId`
- `resourceId`
- `claimState`
- `crowding`
- `estimatedValue`

## Validator

`validate-bot-resource-prospecting.mjs`

## Player-View Proof

Bots route toward several gold sources and create resource competition without stealing the player action surface.

## Risk If Missing

Without prospecting behavior, staging cannot test resource readability or claim pressure.

# 04 Bot Route Intent

Status: planned

## Purpose

Give bots planned routes through prospecting, cover, cashout, and zone pressure.

## Player Need

The match should show visible trails of intention, not bots jittering near the player.

## Owning Kits

- Generic incubator candidate: `n:ai:route-intent`
- GoldRush custom kit: `n:goldrush:bot-route-intent`

## Public API Seed

- `planRoute(botId, objectiveId)`
- `getRoute(botId)`
- `retargetRoute(botId, reason)`

## Internal API Seed

- `scoreRouteRisk(route)`
- `sampleRouteFromMapMasks(seed)`
- `repairBlockedRoute(route)`

## Events

- `bot.route.planned`
- `bot.route.retargeted`
- `bot.route.blocked`

## Snapshot

- `botId`
- `routeId`
- `objectiveId`
- `waypoints`
- `riskScore`

## Validator

`validate-bot-route-intent.mjs`

## Player-View Proof

Routes cross map masks, mines, cover, and cashout points without teleporting or relying on proof placement helpers.

## Risk If Missing

Without route intent, bot pressure never exercises terrain, LOD, cover, or extraction path design.

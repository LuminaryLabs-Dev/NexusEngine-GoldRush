# 16 Bot Difficulty Personas

Status: planned

## Purpose

Define difficulty behaviors that change timing and decisions, not only damage.

## Player Need

Practice should include forgiving, average, and pressure-building opponents with readable behavior changes.

## Owning Kits

- Generic incubator candidate: `n:ai:difficulty-persona`
- GoldRush custom kit: `n:goldrush:bot-difficulty-personas`

## Public API Seed

- `setDifficultyPersona(modeId)`
- `getPersona(botId)`
- `resolvePersonaWeights(modeId)`

## Internal API Seed

- `scaleAimTiming(persona)`
- `scaleRouteRisk(persona)`
- `scaleRecoveryChoices(persona)`

## Events

- `bot.persona.assigned`
- `bot.persona.scaled`
- `bot.persona.reported`

## Snapshot

- `personaId`
- `aimDelay`
- `routeRisk`
- `cashoutAggression`
- `recoveryBias`

## Validator

`validate-bot-difficulty-personas.mjs`

## Player-View Proof

Difficulty proof shows timing, routing, aggression, and recovery changes without hidden unfair damage spikes.

## Risk If Missing

Damage-only difficulty will make bot staging feel cheap and will not teach players.

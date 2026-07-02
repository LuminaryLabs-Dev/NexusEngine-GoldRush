# 01 Bot Role Taxonomy

Status: planned

## Purpose

Define readable bot roles so staging pressure resembles a match instead of random moving targets.

## Player Need

The player should understand whether an opponent is prospecting, guarding, ambushing, fleeing, or extracting.

## Owning Kits

- Generic incubator candidate: `n:ai:role-taxonomy`
- GoldRush custom kit: `n:goldrush:bot-role-taxonomy`

## Public API Seed

- `listRoles()`
- `getRole(roleId)`
- `resolveRoleForScenario(seed, modeId)`

## Internal API Seed

- `scoreRoleCoverage(snapshot)`
- `mapRoleToDifficulty(roleId, difficultyId)`
- `normalizeRoleWeights(weights)`

## Events

- `bot.role.assigned`
- `bot.role.changed`
- `bot.role.coverage.warned`

## Snapshot

- `roleId`
- `readableName`
- `intentTags`
- `allowedObjectives`
- `difficultyBand`

## Validator

`validate-bot-role-taxonomy.mjs`

## Player-View Proof

Role matrix shows coverage for prospectors, guards, ambushers, cowards, extractors, scouts, and late-rush survivors.

## Risk If Missing

If roles are vague, every encounter feels like a target dummy and the staging lab cannot teach combat readability.

# 13 Encounter Director Pacing

Status: planned

## Purpose

Schedule tension, quiet windows, ambushes, and extraction pressure from match state.

## Player Need

The match should breathe: prospecting, warning, conflict, escape, result.

## Owning Kits

- Generic incubator candidate: `n:ai:encounter-director`
- GoldRush custom kit: `n:goldrush:encounter-director`

## Public API Seed

- `tickDirector(dt)`
- `getPacingSnapshot()`
- `forceBeat(beatId)`

## Internal API Seed

- `scoreTension(state)`
- `chooseNextBeat(state)`
- `cooldownEncounterFamily(familyId)`

## Events

- `encounter.beat.selected`
- `encounter.pressure.changed`
- `encounter.cooldown.applied`

## Snapshot

- `phase`
- `tension`
- `beatId`
- `cooldowns`
- `nextWindow`

## Validator

`validate-encounter-director-pacing.mjs`

## Player-View Proof

Director proof shows no immediate combat spam, no empty match, and clear beat reasons tied to player/cargo/zone state.

## Risk If Missing

Without a director, bots either swarm constantly or never create match drama.

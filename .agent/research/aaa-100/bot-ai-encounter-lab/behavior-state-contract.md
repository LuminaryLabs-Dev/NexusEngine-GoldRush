# Behavior State Contract

Status: active

## Contract

Every bot has a small public behavior state and a larger internal state. Public state is for debug, replay, screenshots, and proof. Internal state can contain target scoring, cooldowns, difficulty timings, path repairs, and director hints.

## Public Snapshot

- `botId`
- `roleId`
- `phase`: idle, route, prospect, mine, carry, threaten, cover, cashout, flee, downed, eliminated.
- `objectiveId`
- `position`
- `grounded`
- `cargo`
- `threatCue`
- `proofLabel`

## Internal State

- Route scoring.
- Terrain repair attempts.
- Aim timing.
- Cover scoring.
- Cashout risk scoring.
- Encounter cooldowns.

## Required Reset

A reset must clear role assignment, route, cargo, target, weapon timing, cover claim, downed state, and director cooldown handles.

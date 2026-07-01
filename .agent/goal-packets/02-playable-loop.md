# Playable Loop Goal

Status: active

## Purpose

Define the player-facing loop that implementation and proof should keep moving toward.

## Target Loop

```txt
title
-> lobby party room
-> train loading yard
-> train boarding/departure
-> gold-field spawn
-> over-the-shoulder movement
-> mine gold
-> carry cargo
-> ambush/combat pressure
-> route to cashout
-> hold extraction
-> score receipt
-> results/replay summary
```

## Current Proof Direction

- Scene flow must stay split into sites so different kit groups can mount per scene.
- Camera and WASD must be mouse-look/camera-yaw relative.
- Terrain grounding must use shared terrain collider/raycast state.
- Mining must route through object affordance selection and hold interaction.
- Carrying gold must change visuals, movement, and pressure.
- Cashout must be a visible destination with set-piece, prompt, progress, risk, and receipt.
- Results must show score, pressure, extraction contest, and replay moments without leaking raw internal IDs.

## Next Stronger Proof

Replace direct result-completion helpers with a human-view path that proves:

- mine from an object protokit.
- carry visible gold.
- move toward cashout using camera-relative input.
- hold extraction at a visible set-piece.
- produce score/results from receipts.

## Current Readiness Matrix

- `engine.n.goldrushPlayerLoopReadiness` now tracks resource cue, mine hold, cargo visual, cashout cue, cashout hold, and receipt-backed results.
- `npm run proof:player-loop-readiness` proves the loop without run placement helpers or direct result-completion helpers.
- `engine.n.goldrushCombatLoopReadiness` now tracks cargo threat activation, threat telegraph readability, cover counterplay, cover engagement, shot/damage receipts, and combat results.
- `engine.n.goldrushCombatRouteGuidance` now tracks carried cargo -> threat activation -> stable cover route -> cover action -> cover engagement -> combat receipt readiness, and `npm run proof:combat-route-guidance` proves it through natural train boarding, route-guided mining, camera-relative combat walking, and tick-input cover engagement.
- The next playable-loop gap is higher-fidelity authored/protokit cover, toon-shaded imported models/audio with clear provenance, and interaction feel, not basic natural combat route setup.

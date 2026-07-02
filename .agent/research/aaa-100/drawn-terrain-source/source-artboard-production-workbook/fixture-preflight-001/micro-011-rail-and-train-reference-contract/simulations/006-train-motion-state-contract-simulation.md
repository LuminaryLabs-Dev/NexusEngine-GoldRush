# 006 - Train Motion State Contract Simulation

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Source field: `trainMotionStates`

## Simulated Implementation

1. Add `trainMotionStates` to the tiny source fixture.
2. Add one validator assertion that fails without the field.
3. Add one query or snapshot path that echoes fixture id and revision.
4. Add one consumer expectation for scene flow, train motion, renderer, terrain parity, boarding, camera, audio, simulator proof, or public proof.
5. Add one negative case that proves a fallback cannot pass.

## Predicted Failure Modes

- The renderer draws rails first and train logic retrofits route identity from mesh names.
- The proof script starts the train phase with a direct helper instead of using source rail queries.
- Train departure uses elapsed time and drifts sideways because it does not sample the rail tangent.
- A revision change updates rail mesh but not boarding, camera, audio, replay, simulator proof, or public proof.
- LOD cells drop rail annotations at distance and make the horizon route inconsistent with the playable rail.
- The source field becomes too broad and starts owning economy, combat, AI, or train balance rules.

## Recovery Path

- Keep `trainMotionStates` as a source-data concern only.
- Add only the smallest consumer echo needed to prove ownership.
- Split new rules into a GoldRush scene, control, audio, or presentation kit if they are about train behavior rather than source route identity.

## Simulation Result

Future implementation is acceptable only if validator proves arrival, idle, boarding, door-open, lock-in, departure, ride-away, and offscreen phases use rail progress, speed band, and revision. and the stop condition cannot pass through helper-only, scene-only, renderer-only, camera-only, audio-only, time-only, or stale-proof state.

# Source Proof Restart - Proof Gate Implementation Simulation

Status: active docs-only
Domain: validation / production / release
Generic kit: `n:runtime:validation`
GoldRush kit: `n:goldrush:reality-status`
Related atom: `atomic/12-04-source-proof-restart-proof.md`

## Purpose

Simulate how future implementation would handle the validator, screenshot, video, and deploy acceptance gate for source revision labels, restart policy, deploy boundary, and report hygiene without touching runtime code in this docs-only phase.

## Simulated Implementation Path

1. Re-read the related atom and its paired research note.
2. Define the source revision fields needed for this atom.
3. Add a fixture or fixture extension that exposes only serializable source data.
4. Bind the named generic kit to the fixture through a small public API.
5. Bind the GoldRush kit as the game-specific consumer.
6. Emit one public event when the atom is ready.
7. Expose one snapshot entry that includes source revision, consumer ids, and proof state.
8. Add or extend a validator before changing player-facing visuals.
9. Add a human-view proof state if the atom affects terrain, movement, camera, combat, or interaction.
10. Keep public proof separate from local proof.

## Expected First Failure

The first likely failure is source drift: an existing renderer, physics, gameplay, or route consumer may still use older procedural terrain math. The validator should catch that before the atom is treated as active.

## Expected Player-View Risk

The atom may validate structurally while still reading as a flat prototype. Any player-facing map atom needs screenshots that show foreground, midground, route readability, and a useful focal point.

## Required Evidence Before Coding Can Be Called Done

- source revision id in the fixture
- matching source revision id in every consumer snapshot
- no runtime path or source-only path in public report text
- at least one validator failure case
- local proof label
- public proof label if deployed

## Stop Condition

Stop if implementation needs debug teleporting, hardcoded coordinates outside the source fixture, renderer-owned gameplay truth, or any claim that a source fixture proves full AAA map quality.

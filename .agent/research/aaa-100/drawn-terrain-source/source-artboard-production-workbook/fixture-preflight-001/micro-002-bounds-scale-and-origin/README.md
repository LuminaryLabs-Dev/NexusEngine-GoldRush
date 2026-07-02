# Micro 002 - Bounds Scale And Origin

Status: implemented-local
Parent atom: `002-bounds-scale-and-origin`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Break the bounds, scale, and origin atom into micro-steps small enough for the first source-fixture validator implementation.

## Rule

The first terrain implementation must prove world bounds and scale before rendering, collider, placement, LOD, route, network partition, or gameplay consumers expand.

## Why This Matters

The current map can keep plateauing if it only gets denser. A larger drawn desert only becomes playable when every consumer agrees on coordinate axes, unit scale, playable bounds, origin, cell size, vertical range, query boundary behavior, traversal budgets, LOD distances, physics scale, and stale-proof behavior after scale changes.

## Files

- `micro-matrix.md`
- `research-matrix.md`
- `simulation-matrix.md`
- `audit-matrix.md`
- `micro/`
- `research/`
- `simulations/`
- `audits/`

## Exit Gate

This micro-runway is locally implemented when each micro-step names and validates its source field, validator case, consumer echo, player-scale proof, and restart implication.

## Local Proof

- `src/content/goldrushAuthoredTerrainFixture.js` now exposes coordinate system, unit scale, world bounds, origin, cell size, height range, bounds policy, query modes, proof anchors, LOD/partition echoes, consumer scale echoes, and scale revision policy.
- `tools/validation/validate-authored-terrain-fixture.mjs` validates the happy path and negative cases for zero scale, out-of-bounds playable clamp, scale echo drift, deterministic source hash changes, route budgets, and scale-change stale flags.
- Current local fixture revision after adding scale source fields: `rev-e85d24b5`.

## Known Limits

- This does not prove authored height samples, masks, normal/slope data, terrain geometry, collider parity, raycast placement, gameplay zones, human-view proof, public proof, or 60-player staging.
- The next source-fixture atom is `micro-003-height-sample-contract`.

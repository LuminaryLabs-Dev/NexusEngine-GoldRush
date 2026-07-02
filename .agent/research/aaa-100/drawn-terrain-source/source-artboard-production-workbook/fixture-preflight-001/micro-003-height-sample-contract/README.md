# Micro 003 - Height Sample Contract

Status: implemented-local
Parent atom: `003-height-sample-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Break the height sample atom into micro-steps small enough for the first terrain-heightfield validator implementation.

## Rule

The first terrain implementation must prove height samples from the authored fixture before renderer, collider, movement, placement, LOD, gameplay, or human-view proof can claim terrain correctness.

## Why This Matters

GoldRush cannot become a high-fidelity extraction battle royale if height is still inferred separately by renderer, physics, movement, or prop placement. The drawn terrain source must expose finite, addressable, versioned height samples that every consumer can echo.

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

This micro-runway is locally implemented when each micro-step names and validates its source field, validator case, consumer echo, negative fixture case, and stale-proof implication.

## Local Proof

- `src/content/goldrushAuthoredTerrainFixture.js` now exposes a finite source-owned height grid, world-space normalization policy, origin offset, bilinear `sampleHeight` query, proof points, height consumer parity, and height revision stale-proof policy.
- `tools/validation/validate-authored-terrain-fixture.mjs` validates the happy path and negative cases for missing grids, bad dimensions, non-finite values, out-of-range values, consumer parity drift, outside query rejection, and height-change stale flags.
- Current local fixture revision after adding height source fields: `rev-0f3dfa75`.

## Known Limits

- This does not prove authored masks, normals, slope classes, LOD geometry, collider parity from the authored mesh, raycast placement, gameplay zones, human-view proof, public proof, or 60-player staging.
- The next source-fixture atom is `micro-004-normal-and-slope-contract`.

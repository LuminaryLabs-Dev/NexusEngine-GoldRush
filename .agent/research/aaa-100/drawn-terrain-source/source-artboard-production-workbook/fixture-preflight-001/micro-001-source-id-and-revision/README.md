# Micro 001 - Source Id And Revision

Status: implemented-local
Parent atom: `001-source-id-and-revision`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Break the source identity atom into micro-steps small enough for the first validator implementation. This packet now has local source-contract implementation and validator coverage.

## Rule

The first implementation must prove source identity before rendering, collider, placement, gameplay, or proof consumers expand.

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

This micro-runway is locally implemented when `node tools/validation/validate-authored-terrain-fixture.mjs` passes.

Current proof:

- Source module: `src/content/goldrushAuthoredTerrainFixture.js`
- Validator: `tools/validation/validate-authored-terrain-fixture.mjs`
- Generic kit: `n:world:authored-terrain-mesh`
- GoldRush kit: `n:goldrush:desert-world-map`
- Local validator status: `authored-terrain-fixture-ready`
- Known limit: render, collider, placement, gameplay, local proof, and public proof currently echo the source revision, but do not yet consume authored terrain geometry, bounds, height samples, masks, routes, mines, cashout sites, rail paths, or cover annotations.

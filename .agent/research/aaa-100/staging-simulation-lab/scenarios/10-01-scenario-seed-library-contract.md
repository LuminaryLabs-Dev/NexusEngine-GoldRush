# Scenario Seed Library - Contract

Status: planned docs-only
Scenario: 10 Scenario Seed Library
Domain: validation/scenario
Owner kit: n:goldrush:scenario-seed-library

## Purpose

Define owner kit, public API, private API, event, snapshot, reset, and stage boundary.

## Scenario Intention

Store deterministic seeds for terrain, bots, frontier conditions, gold zones, pressure, and extraction sites.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:scenario-seed-library`.
2. Confirm whether the scenario is practice, bot fill, scale simulation, browser proof, public proof, or future live network proof.
3. Define the public API call or scenario seed needed to start it.
4. Define the private setup allowed before the player route begins.
5. Define the event emitted when the scenario state changes.
6. Define the snapshot required for validator and browser proof.
7. Define the receipts that should survive scenario reset or match end.
8. Define the fakeout that must fail validation.
9. Define the human-view evidence required if the player sees or feels this scenario.
10. Define the restart packet that should be written if this scenario fails.

## Event And Snapshot

- Event: `scenario.seed.loaded`
- Snapshot: `scenarioSeedLibrary`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-scenario-seed-library`

## Human Proof Seed

Two runs with the same seed produce the same high-level world, roster, and receipt facts.

## Fakeout To Prevent

Tests are deterministic only because hidden globals or local browser state persist.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.


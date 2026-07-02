# Staging Mode Registry - Contract

Status: planned docs-only
Scenario: 01 Staging Mode Registry
Domain: staging/runtime
Owner kit: n:goldrush:staging-mode-registry

## Purpose

Define owner kit, public API, private API, event, snapshot, reset, and stage boundary.

## Scenario Intention

Name every non-production mode so testing, bot fill, private rooms, and public proof do not blur together.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:staging-mode-registry`.
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

- Event: `staging.mode.selected`
- Snapshot: `stagingModeRegistry`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-staging-mode-registry`

## Human Proof Seed

Visible mode label or sanitized proof state distinguishes practice, bot fill, 20-player sim, 60-player sim, and live public modes.

## Fakeout To Prevent

A hidden debug flag changes behavior but no player, tester, or validator can see which mode is active.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.


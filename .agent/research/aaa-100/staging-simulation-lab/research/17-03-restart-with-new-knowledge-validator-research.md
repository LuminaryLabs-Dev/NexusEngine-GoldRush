# Restart With New Knowledge - Validator Research

Status: planned docs-only
Related packet: ../scenarios/17-03-restart-with-new-knowledge-validator.md

## Reference Signal

Game engine references are useful as a missing-feature checklist for simulation, runtime, rendering, physics, tooling, and proof surfaces without turning GoldRush into an engine.

Reference: https://github.com/collections/game-engines

## Product Implication

GoldRush needs a staging environment that is useful to one local tester while still honestly preparing for 60-player play. This scenario should make one part of the final loop more testable without pretending that simulated scale is live multiplayer.

## Architecture Implication

The owner kit is `n:goldrush:staging-restart-ledger`. It should expose a small public API, use private helpers for setup and measurement, emit `staging.restart.recorded`, and expose `restartWithNewKnowledge` for validation.

## Data Implication

Reports should classify:

- mode kind.
- target player count.
- actual human count.
- bot count.
- simulated entity count.
- proof target.
- fakeout status.
- remaining live-readiness gap.

## Validation Implication

Use `validate-staging-restart-ledger` as the first validator seed. Negative fixtures must fail the fakeout: Failures are fixed ad hoc and future agents repeat the same false assumptions.

## Human-View Implication

A staging scenario is not useful unless a human can understand what is being rehearsed. If it is visible, capture screenshots; if it is motion-sensitive, capture short video; if it is data-only, keep a sanitized report with clear proof scope.

## Restart Question

If this staging scenario fails, should the next pass split the owner kit, reduce the entity count, add a bot archetype, replace a helper path, or add a new proof gate?


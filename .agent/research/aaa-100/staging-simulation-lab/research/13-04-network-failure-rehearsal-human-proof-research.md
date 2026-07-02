# Network Failure Rehearsal - Human Proof Research

Status: planned docs-only
Related packet: ../scenarios/13-04-network-failure-rehearsal-human-proof.md

## Reference Signal

Browser game frameworks remind GoldRush to keep render loop, input, WebGL, asset loading, and performance validation separate from gameplay simulation.

Reference: https://github.com/collections/javascript-game-engines

## Product Implication

GoldRush needs a staging environment that is useful to one local tester while still honestly preparing for 60-player play. This scenario should make one part of the final loop more testable without pretending that simulated scale is live multiplayer.

## Architecture Implication

The owner kit is `n:goldrush:network-failure-rehearsal`. It should expose a small public API, use private helpers for setup and measurement, emit `network.failure.rehearsed`, and expose `networkFailureRehearsal` for validation.

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

Use `validate-network-failure-rehearsal` as the first validator seed. Negative fixtures must fail the fakeout: Happy-path party proof passes but failures lock train boarding or corrupt match receipts.

## Human-View Implication

A staging scenario is not useful unless a human can understand what is being rehearsed. If it is visible, capture screenshots; if it is motion-sensitive, capture short video; if it is data-only, keep a sanitized report with clear proof scope.

## Restart Question

If this staging scenario fails, should the next pass split the owner kit, reduce the entity count, add a bot archetype, replace a helper path, or add a new proof gate?


# Combat Pressure Rehearsal - Contract Research

Status: planned docs-only
Related packet: ../scenarios/14-01-combat-pressure-rehearsal-contract.md

## Reference Signal

PUBG frames battle royale as staging, land, loot, movement, pressure, survival, and training-mode practice.

Reference: https://pubg.com/en/game-info

## Product Implication

GoldRush needs a staging environment that is useful to one local tester while still honestly preparing for 60-player play. This scenario should make one part of the final loop more testable without pretending that simulated scale is live multiplayer.

## Architecture Implication

The owner kit is `n:goldrush:combat-pressure-rehearsal`. It should expose a small public API, use private helpers for setup and measurement, emit `combat.rehearsal.phase.changed`, and expose `combatPressureRehearsal` for validation.

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

Use `validate-combat-pressure-rehearsal` as the first validator seed. Negative fixtures must fail the fakeout: Combat receipts exist but no player-facing fight, cover, hit, or recovery readability exists.

## Human-View Implication

A staging scenario is not useful unless a human can understand what is being rehearsed. If it is visible, capture screenshots; if it is motion-sensitive, capture short video; if it is data-only, keep a sanitized report with clear proof scope.

## Restart Question

If this staging scenario fails, should the next pass split the owner kit, reduce the entity count, add a bot archetype, replace a helper path, or add a new proof gate?


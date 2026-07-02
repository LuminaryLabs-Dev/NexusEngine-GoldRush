# Playwright Human Staging Proof - Scenario Research

Status: planned docs-only
Related packet: ../scenarios/12-02-playwright-human-staging-proof-scenario.md

## Reference Signal

Apex separates competitive, relaxed, bot, private, training, and firing-range modes; it also documents 60-player Bot Royale and 60-player private match surfaces.

Reference: https://help.ea.com/en/articles/apex-legends/game-modes/

## Product Implication

GoldRush needs a staging environment that is useful to one local tester while still honestly preparing for 60-player play. This scenario should make one part of the final loop more testable without pretending that simulated scale is live multiplayer.

## Architecture Implication

The owner kit is `n:goldrush:playwright-human-staging-proof`. It should expose a small public API, use private helpers for setup and measurement, emit `browser.proof.staging.captured`, and expose `playwrightHumanStagingProof` for validation.

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

Use `proof:live-state-audit` as the first validator seed. Negative fixtures must fail the fakeout: A report captures state but no screenshot shows what the player sees.

## Human-View Implication

A staging scenario is not useful unless a human can understand what is being rehearsed. If it is visible, capture screenshots; if it is motion-sensitive, capture short video; if it is data-only, keep a sanitized report with clear proof scope.

## Restart Question

If this staging scenario fails, should the next pass split the owner kit, reduce the entity count, add a bot archetype, replace a helper path, or add a new proof gate?


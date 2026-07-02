# Single Player Practice Loop - Contract

Status: planned docs-only
Scenario: 02 Single Player Practice Loop
Domain: staging/player-loop
Owner kit: n:goldrush:single-player-practice

## Purpose

Define owner kit, public API, private API, event, snapshot, reset, and stage boundary.

## Scenario Intention

Let one player run title to lobby to train to mine to cashout to results without network blockers.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:single-player-practice`.
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

- Event: `staging.practice.loop.started`
- Snapshot: `singlePlayerPracticeLoop`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-single-player-practice-loop`

## Human Proof Seed

One browser walks, mines, carries, sees pressure, extracts, and reaches receipt-backed results.

## Fakeout To Prevent

A solo route reaches results only through direct completion helpers or teleports.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.


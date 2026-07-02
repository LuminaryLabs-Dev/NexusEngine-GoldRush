# Sixty Player Scale Harness - Human Proof

Status: planned docs-only
Scenario: 08 Sixty Player Scale Harness
Domain: network/performance/simulation
Owner kit: n:goldrush:sixty-player-scale-harness

## Purpose

Define the screenshot, video, player-view, and report-readability evidence required for trust.

## Scenario Intention

Prove 60-player state shape, partition budget, snapshots, event volume, and fakeout labeling before live play.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:sixty-player-scale-harness`.
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

- Event: `staging.sixty.scale.sampled`
- Snapshot: `sixtyPlayerScaleHarness`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-sixty-player-scale-harness`

## Human Proof Seed

Simulator report says simulated scale, includes 60 roster records, and never claims live multiplayer proof.

## Fakeout To Prevent

A single-browser proof is described as live 60-player readiness.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.


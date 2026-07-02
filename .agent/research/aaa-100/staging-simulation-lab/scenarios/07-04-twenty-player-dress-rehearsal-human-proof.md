# Twenty Player Dress Rehearsal - Human Proof

Status: planned docs-only
Scenario: 07 Twenty Player Dress Rehearsal
Domain: network/performance/staging
Owner kit: n:goldrush:twenty-player-dress-rehearsal

## Purpose

Define the screenshot, video, player-view, and report-readability evidence required for trust.

## Scenario Intention

Start with a 20-player simulated match so room, bot, event, and performance budgets can be tested before 60.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:twenty-player-dress-rehearsal`.
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

- Event: `staging.twenty.roster.ready`
- Snapshot: `twentyPlayerDressRehearsal`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-twenty-player-dress-rehearsal`

## Human Proof Seed

Scenario report and browser proof show 20 simulated entities influencing the loop without frame or event spikes.

## Fakeout To Prevent

A 20-player count exists but no update budget, event volume, or visible pressure is measured.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.


# Economy Reward Rehearsal - Contract

Status: planned docs-only
Scenario: 15 Economy Reward Rehearsal
Domain: gameplay/match/economy
Owner kit: n:goldrush:economy-reward-rehearsal

## Purpose

Define owner kit, public API, private API, event, snapshot, reset, and stage boundary.

## Scenario Intention

Rehearse mined value, carried risk, extracted value, lost cargo, bonuses, penalties, and result presentation.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:economy-reward-rehearsal`.
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

- Event: `economy.rehearsal.receipt.applied`
- Snapshot: `economyRewardRehearsal`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-economy-reward-rehearsal`

## Human Proof Seed

Results proof explains how gold, pressure, contest, loss, extraction, and rewards formed the final score.

## Fakeout To Prevent

Results show a score but the score does not derive from mined, carried, contested, and extracted receipts.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.


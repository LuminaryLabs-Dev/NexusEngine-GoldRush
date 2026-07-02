# Dummy Squad Simulation - Scenario

Status: planned docs-only
Scenario: 06 Dummy Squad Simulation
Domain: network/staging
Owner kit: n:goldrush:dummy-squad-simulation

## Purpose

Define the deterministic setup, player route, bot or scale condition, and expected receipts.

## Scenario Intention

Represent squads, parties, leaders, and team states in single-player staging without claiming live networking.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:dummy-squad-simulation`.
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

- Event: `staging.squad.state.changed`
- Snapshot: `dummySquadSimulation`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-dummy-squad-simulation`

## Human Proof Seed

Simulator state shows squad membership, leader, alive/downed/extracted state, and receipt ownership.

## Fakeout To Prevent

The report says squad play but every entity acts as isolated singletons.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.


# NexusSimulator Contract - Validator

Status: planned docs-only
Scenario: 11 NexusSimulator Contract
Domain: validation/simulator
Owner kit: n:goldrush:nexus-simulator-contract

## Purpose

Define the CLI, simulator, browser, or public proof that fails until the scenario is honest.

## Scenario Intention

Define what the simulator may drive, what it may observe, and which gameplay shortcuts are forbidden.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:nexus-simulator-contract`.
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

- Event: `simulator.command.applied`
- Snapshot: `nexusSimulatorContract`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-nexus-simulator-contract`

## Human Proof Seed

Simulator commands map to player-like inputs or documented scenario setup, and reports label any setup-only action.

## Fakeout To Prevent

The simulator proves internal calls that no real player can perform.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.


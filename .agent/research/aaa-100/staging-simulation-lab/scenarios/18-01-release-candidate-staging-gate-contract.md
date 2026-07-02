# Release Candidate Staging Gate - Contract

Status: planned docs-only
Scenario: 18 Release Candidate Staging Gate
Domain: release/QA
Owner kit: n:goldrush:release-candidate-staging-gate

## Purpose

Define owner kit, public API, private API, event, snapshot, reset, and stage boundary.

## Scenario Intention

Define the minimum staging, simulator, local browser, public browser, and report hygiene proof before release claims.

## Atomic Substeps

1. Confirm the scenario owner is `n:goldrush:release-candidate-staging-gate`.
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

- Event: `release.staging.gate.evaluated`
- Snapshot: `releaseCandidateStagingGate`
- Reset: clear transient bots, inputs, and scene setup; retain only sanitized scenario report and durable match receipts when owned by match kits.

## Validator Seed

`validate-release-candidate-staging-gate`

## Human Proof Seed

Release packet lists all required proofs, their latest timestamps, scope, target, and remaining gaps.

## Fakeout To Prevent

Build passes while the title-to-results loop, staging mode, or public proof is stale.

## Implementation Boundary

This is docs-only. Runtime kits, simulator commands, browser automation, network behavior, and deployment gates are deferred until implementation mode resumes.


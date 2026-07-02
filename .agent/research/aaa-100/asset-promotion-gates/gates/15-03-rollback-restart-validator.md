# Rollback Restart - Validator

Status: planned docs-only
Phase: 15 Rollback Restart
Domain: production/versioning
Candidate kit: n:goldrush:asset-rollback-restart

## Purpose

Define the CLI or browser proof that fails until the phase is truly satisfied.

## Plateau Risk

Bad assets or bad assumptions stay embedded because there is no versioned restart path.

## Atomic Substeps

1. Confirm the owner domain is `production/versioning`.
2. Confirm the target kit is `n:goldrush:asset-rollback-restart` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `restartId`
- `blockedRevision`
- `successorRevision`
- `lesson`
- `rollbackPlan`

## Required Checks

- validator command
- positive fixture
- negative fixture
- report hygiene check

## Event And Snapshot Seed

- Event: `rollback-restart.validator.evaluated`
- Snapshot: `rollback-restart.validator.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Restart packet records what was learned, what asset revision is blocked, what successor decision replaces it, and how to revert.

## Edge Case

A blocked asset family should produce a new candidate or new kit contract, not a silent renderer workaround.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


# Collider Interaction Role - Validator

Status: planned docs-only
Phase: 11 Collider Interaction Role
Domain: physics/gameplay
Candidate kit: n:goldrush:asset-collider-interaction

## Purpose

Define the CLI or browser proof that fails until the phase is truly satisfied.

## Plateau Risk

A visible object cannot be walked on, blocked by, mined, entered, boarded, covered behind, or extracted from reliably.

## Atomic Substeps

1. Confirm the owner domain is `physics/gameplay`.
2. Confirm the target kit is `n:goldrush:asset-collider-interaction` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `colliderKind`
- `bodyKind`
- `affordanceId`
- `interactionRange`
- `receiptKind`

## Required Checks

- validator command
- positive fixture
- negative fixture
- report hygiene check

## Event And Snapshot Seed

- Event: `collider-interaction-role.validator.evaluated`
- Snapshot: `collider-interaction-role.validator.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Collider and interaction role record declares physical body, affordance, interaction range, and receipt outcome.

## Edge Case

Visual-only clutter should explicitly say no collider and no interaction so it is not confused with missing gameplay.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


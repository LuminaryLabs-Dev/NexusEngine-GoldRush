# Protokit Registration - Human Proof

Status: planned docs-only
Phase: 09 Protokit Registration
Domain: content/kits
Candidate kit: n:goldrush:asset-protokit-registry

## Purpose

Define the player-facing, reviewer-facing, or browser-visible proof needed before the phase can be considered resolved.

## Plateau Risk

Imported models become anonymous meshes controlled by renderer code.

## Atomic Substeps

1. Confirm the owner domain is `content/kits`.
2. Confirm the target kit is `n:goldrush:asset-protokit-registry` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `assetKitId`
- `domainPath`
- `familyId`
- `events`
- `snapshot`
- `validatorId`

## Required Checks

- screenshot or review state
- acceptance criteria
- known fakeouts
- restart note

## Event And Snapshot Seed

- Event: `protokit-registration.human-proof.evaluated`
- Snapshot: `protokit-registration.human-proof.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Every runtime candidate maps to a named protokit with domainPath, public API, events, snapshot, reset, and validator.

## Edge Case

A simple object can remain simple, but still needs a stable descriptor so future logic has an owner.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


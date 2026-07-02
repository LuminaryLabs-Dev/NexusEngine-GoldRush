# Source Candidate Intake - Human Proof

Status: planned docs-only
Phase: 01 Source Candidate Intake
Domain: content/source
Candidate kit: n:goldrush:asset-source-intake

## Purpose

Define the player-facing, reviewer-facing, or browser-visible proof needed before the phase can be considered resolved.

## Plateau Risk

A file or pack is treated as usable because it looks useful.

## Atomic Substeps

1. Confirm the owner domain is `content/source`.
2. Confirm the target kit is `n:goldrush:asset-source-intake` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `candidateId`
- `sourceUrl`
- `sourceKind`
- `assetFamilyId`
- `intendedUse`
- `runtimePromotion:false`

## Required Checks

- screenshot or review state
- acceptance criteria
- known fakeouts
- restart note

## Event And Snapshot Seed

- Event: `source-candidate-intake.human-proof.evaluated`
- Snapshot: `source-candidate-intake.human-proof.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Candidate record exists with source URL, pack name, intended asset family, and no runtime path.

## Edge Case

Candidate source pages can move or disappear, so source evidence must be copied into a sanitized evidence record.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


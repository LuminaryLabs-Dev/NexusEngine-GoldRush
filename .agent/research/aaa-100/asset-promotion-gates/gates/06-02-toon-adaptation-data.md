# Toon Adaptation - Data Contract

Status: planned docs-only
Phase: 06 Toon Adaptation
Domain: art/render
Candidate kit: n:goldrush:toon-adaptation

## Purpose

Define the minimal data fields needed to move the phase forward without leaking implementation details.

## Plateau Risk

Realistic, mismatched, or primitive assets break the high-fidelity toon western direction.

## Atomic Substeps

1. Confirm the owner domain is `art/render`.
2. Confirm the target kit is `n:goldrush:toon-adaptation` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `paletteRole`
- `materialRole`
- `outlinePolicy`
- `normalPolicy`
- `screenshotGate`

## Required Checks

- required fields
- serializable snapshot
- event names
- redacted proof fields

## Event And Snapshot Seed

- Event: `toon-adaptation.data.evaluated`
- Snapshot: `toon-adaptation.data.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Adaptation record defines palette role, outline policy, material simplification, and screenshot acceptance.

## Edge Case

Poly Haven-style realistic sources may be reference/material sources instead of direct runtime models.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


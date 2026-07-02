# Format And Conversion - Human Proof

Status: planned docs-only
Phase: 05 Format And Conversion
Domain: content/pipeline
Candidate kit: n:goldrush:format-conversion

## Purpose

Define the player-facing, reviewer-facing, or browser-visible proof needed before the phase can be considered resolved.

## Plateau Risk

Unity, FBX, blend, wav, or large texture evidence is treated as browser-ready runtime content.

## Atomic Substeps

1. Confirm the owner domain is `content/pipeline`.
2. Confirm the target kit is `n:goldrush:format-conversion` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `inputFormat`
- `outputFormat`
- `conversionTool`
- `conversionStatus`
- `unsupportedFields`

## Required Checks

- screenshot or review state
- acceptance criteria
- known fakeouts
- restart note

## Event And Snapshot Seed

- Event: `format-and-conversion.human-proof.evaluated`
- Snapshot: `format-and-conversion.human-proof.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Conversion plan declares input format, output format, conversion tool, loss notes, and unsupported fields.

## Edge Case

External conversion requests remain review artifacts until a browser-ready output and hash exist.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


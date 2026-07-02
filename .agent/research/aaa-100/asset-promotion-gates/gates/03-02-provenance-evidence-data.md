# Provenance Evidence - Data Contract

Status: planned docs-only
Phase: 03 Provenance Evidence
Domain: content/provenance
Candidate kit: n:goldrush:provenance-evidence

## Purpose

Define the minimal data fields needed to move the phase forward without leaking implementation details.

## Plateau Risk

An asset has a license but no credible origin trail or version identity.

## Atomic Substeps

1. Confirm the owner domain is `content/provenance`.
2. Confirm the target kit is `n:goldrush:provenance-evidence` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `provenanceId`
- `sourceOwner`
- `retrievedAt`
- `sourceRevision`
- `sourceHash`

## Required Checks

- required fields
- serializable snapshot
- event names
- redacted proof fields

## Event And Snapshot Seed

- Event: `provenance-evidence.data.evaluated`
- Snapshot: `provenance-evidence.data.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Provenance record links source page, pack version or retrieval date, author/source identity, and hashable bytes.

## Edge Case

Mirrored asset packs need original source evidence, not only the mirror or downloaded archive name.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


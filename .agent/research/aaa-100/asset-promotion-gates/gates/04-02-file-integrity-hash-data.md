# File Integrity Hash - Data Contract

Status: planned docs-only
Phase: 04 File Integrity Hash
Domain: content/security
Candidate kit: n:goldrush:file-integrity

## Purpose

Define the minimal data fields needed to move the phase forward without leaking implementation details.

## Plateau Risk

Files change between candidate, conversion, review, and runtime promotion without traceability.

## Atomic Substeps

1. Confirm the owner domain is `content/security`.
2. Confirm the target kit is `n:goldrush:file-integrity` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `fileId`
- `sourceHash`
- `outputHash`
- `byteSize`
- `format`
- `scanStatus`

## Required Checks

- required fields
- serializable snapshot
- event names
- redacted proof fields

## Event And Snapshot Seed

- Event: `file-integrity-hash.data.evaluated`
- Snapshot: `file-integrity-hash.data.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Each source and output file has deterministic hash, byte size, MIME or format classification, and scan result.

## Edge Case

A converted GLB or audio file must not reuse the source hash as if no conversion happened.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


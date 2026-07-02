# Browser Public Proof - Data Contract

Status: planned docs-only
Phase: 14 Browser Public Proof
Domain: validation/proof
Candidate kit: n:goldrush:asset-browser-proof

## Purpose

Define the minimal data fields needed to move the phase forward without leaking implementation details.

## Plateau Risk

An asset is registered but not visible, grounded, interactive, performant, or present in the public build.

## Atomic Substeps

1. Confirm the owner domain is `validation/proof`.
2. Confirm the target kit is `n:goldrush:asset-browser-proof` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `proofId`
- `siteId`
- `screenshotId`
- `snapshotDigest`
- `publicBuildUrl`
- `leakScanStatus`

## Required Checks

- required fields
- serializable snapshot
- event names
- redacted proof fields

## Event And Snapshot Seed

- Event: `browser-public-proof.data.evaluated`
- Snapshot: `browser-public-proof.data.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Local and public browser proof screenshots show the asset in its intended scene, with state snapshot and no report leaks.

## Edge Case

Local proof alone does not prove Pages deployment; public proof must be a separate evidence item.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


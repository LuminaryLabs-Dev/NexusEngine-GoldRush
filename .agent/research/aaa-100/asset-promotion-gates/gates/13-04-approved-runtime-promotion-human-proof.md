# Approved Runtime Promotion - Human Proof

Status: planned docs-only
Phase: 13 Approved Runtime Promotion
Domain: runtime/content
Candidate kit: n:goldrush:approved-runtime-assets

## Purpose

Define the player-facing, reviewer-facing, or browser-visible proof needed before the phase can be considered resolved.

## Plateau Risk

Approved or sanitized review assets are copied into runtime without the promotion planner contract.

## Atomic Substeps

1. Confirm the owner domain is `runtime/content`.
2. Confirm the target kit is `n:goldrush:approved-runtime-assets` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `runtimePath`
- `registryId`
- `approvalId`
- `sourceHash`
- `outputHash`
- `assetKitId`

## Required Checks

- screenshot or review state
- acceptance criteria
- known fakeouts
- restart note

## Event And Snapshot Seed

- Event: `approved-runtime-promotion.human-proof.evaluated`
- Snapshot: `approved-runtime-promotion.human-proof.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Promotion record writes only safe browser runtime paths, registry entries, source/output hash links, and approval ids.

## Edge Case

Runtime paths must stay browser-relative and must never point to local, raw, sanitized, or review folders.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


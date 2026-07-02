# License Evidence - Policy

Status: planned docs-only
Phase: 02 License Evidence
Domain: content/legal
Candidate kit: n:goldrush:license-evidence

## Purpose

Define the deny-by-default rule, owner domain, allowed state transitions, and stop conditions.

## Plateau Risk

A CC0-friendly source channel is mistaken for a per-asset license approval.

## Atomic Substeps

1. Confirm the owner domain is `content/legal`.
2. Confirm the target kit is `n:goldrush:license-evidence` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `licenseId`
- `licenseUrl`
- `licenseTextDigest`
- `attributionRequired`
- `reviewStatus`

## Required Checks

- owner domain
- allowed transitions
- blocked transitions
- stop condition

## Event And Snapshot Seed

- Event: `license-evidence.policy.evaluated`
- Snapshot: `license-evidence.policy.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

License record names the exact license, source evidence, attribution requirement, and unresolved questions.

## Edge Case

OpenGameArt-style community assets need item-level review even when the source is generally useful.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


# Scale Pivot Origin - Human Proof

Status: planned docs-only
Phase: 07 Scale Pivot Origin
Domain: world/content
Candidate kit: n:goldrush:asset-transform-contract

## Purpose

Define the player-facing, reviewer-facing, or browser-visible proof needed before the phase can be considered resolved.

## Plateau Risk

Assets float, clip, rotate incorrectly, or spawn off-ground because transform rules are implicit.

## Atomic Substeps

1. Confirm the owner domain is `world/content`.
2. Confirm the target kit is `n:goldrush:asset-transform-contract` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `unitScale`
- `pivot`
- `forwardAxis`
- `groundAnchor`
- `bounds`
- `placementOffset`

## Required Checks

- screenshot or review state
- acceptance criteria
- known fakeouts
- restart note

## Event And Snapshot Seed

- Event: `scale-pivot-origin.human-proof.evaluated`
- Snapshot: `scale-pivot-origin.human-proof.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Transform contract records units, pivot, forward axis, ground anchor, bounds, and raycast placement offset.

## Edge Case

Character, train, rail, building, and rock assets need different anchor rules and cannot share one transform guess.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


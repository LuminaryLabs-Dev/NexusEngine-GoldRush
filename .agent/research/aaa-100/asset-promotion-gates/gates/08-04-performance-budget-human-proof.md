# Performance Budget - Human Proof

Status: planned docs-only
Phase: 08 Performance Budget
Domain: performance/content
Candidate kit: n:goldrush:asset-performance-budget

## Purpose

Define the player-facing, reviewer-facing, or browser-visible proof needed before the phase can be considered resolved.

## Plateau Risk

High-volume assets make 60-player browser play impossible before gameplay is complete.

## Atomic Substeps

1. Confirm the owner domain is `performance/content`.
2. Confirm the target kit is `n:goldrush:asset-performance-budget` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `triangles`
- `drawCalls`
- `materials`
- `textureBytes`
- `lodPolicy`
- `instancePolicy`

## Required Checks

- screenshot or review state
- acceptance criteria
- known fakeouts
- restart note

## Event And Snapshot Seed

- Event: `performance-budget.human-proof.evaluated`
- Snapshot: `performance-budget.human-proof.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Budget record includes triangles, draw calls, material count, texture memory, animation clips, and LOD plan.

## Edge Case

Hero set pieces can have higher budgets than scatter props, but the policy must say why.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


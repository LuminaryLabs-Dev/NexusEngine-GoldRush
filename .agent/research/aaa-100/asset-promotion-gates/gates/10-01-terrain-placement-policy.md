# Terrain Placement - Policy

Status: planned docs-only
Phase: 10 Terrain Placement
Domain: world/placement
Candidate kit: n:goldrush:terrain-placement-gate

## Purpose

Define the deny-by-default rule, owner domain, allowed state transitions, and stop conditions.

## Plateau Risk

Assets are placed visually without terrain mask, raycast, slope, route, or gameplay-zone awareness.

## Atomic Substeps

1. Confirm the owner domain is `world/placement`.
2. Confirm the target kit is `n:goldrush:terrain-placement-gate` or create a new local GoldRush kit packet before implementation resumes.
3. Confirm this phase is not trying to promote runtime content by implication.
4. Record only the required minimal data fields.
5. Emit or define the phase event that downstream kits can subscribe to.
6. Define a serializable snapshot that can be inspected in browser proof.
7. Define a reset rule for failed or rejected phase data.
8. Add a negative case that proves unsafe promotion stays blocked.
9. Add a positive case that proves valid data can advance to the next phase.
10. Add a restart note for what to do if this phase fails repeatedly.

## Required Data

- `terrainRevision`
- `maskId`
- `slopeLimit`
- `raycastHit`
- `clusterTags`
- `avoidTags`

## Required Checks

- owner domain
- allowed transitions
- blocked transitions
- stop condition

## Event And Snapshot Seed

- Event: `terrain-placement.policy.evaluated`
- Snapshot: `terrain-placement.policy.snapshot`
- Reset: discard unapproved phase outputs and keep only sanitized rejection evidence.

## Proof

Placement record names terrain source revision, mask, slope limits, raycast result, and avoid/cluster tags.

## Edge Case

Mine entrances, towns, rails, extraction sites, and gold seams need authored anchors, not only random scatter.

## Implementation Boundary

This is a docs-only gate. Runtime code, asset copying, public asset paths, and actual approval mutation are out of scope until implementation mode resumes.


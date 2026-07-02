# 024.014 Lod Human View Proof - Domain Implication

Status: research-planned
Parent: 024 LOD ring contract
Atomic: 024.014 Lod Human View Proof
Domain: world/render
Owning kit candidate: `n:render:terrain-lod-rings`

## Domain Implication

Require spawn, movement, look-left/right, high-vista, and extraction-site screenshots for each LOD pass.

## Ownership

- Domain owns the data contract and validation boundary.
- Renderer, physics, gameplay, and network systems consume the snapshot.
- No downstream kit should invent a second copy of this concern.

## Public Data Shape

- `mapRevisionId`
- `atomicId`
- `domain`
- `sourceRegion`
- `derivedState`
- `proofState`

## Public API Shape

- `snapshot()`: expose stable data for proof and downstream kits.
- `validate()`: return named invariant failures.
- `reset(revisionId)`: rebuild derived data when source terrain changes.

## Private Work

Private helpers can parse source layers, build derived geometry, normalize masks, calculate placement, or assemble proof facts. The UI and gameplay should only see the stable public snapshot.

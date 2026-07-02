# 023.006 Gold Density Mask - Domain Implication

Status: research-planned
Parent: 023 Height and mask data model
Atomic: 023.006 Gold Density Mask
Domain: world
Owning kit candidate: `n:world:terrain-heightfield`

## Domain Implication

Expose where gold can appear, how dense it is, and which extraction risk tier it belongs to.

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

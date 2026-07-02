# 021.001 World Bounds - Domain Implication

Status: research-planned
Parent: 021 Terrain intention map
Atomic: 021.001 World Bounds
Domain: world
Owning kit candidate: `n:goldrush:authored-desert-map`

## Domain Implication

Define playable world bounds that support 60-player spread, train arrival, extraction routes, and far-horizon disguise.

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

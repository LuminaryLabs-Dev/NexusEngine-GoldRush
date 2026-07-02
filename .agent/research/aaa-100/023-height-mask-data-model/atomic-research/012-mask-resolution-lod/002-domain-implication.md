# 023.012 Mask Resolution Lod - Domain Implication

Status: research-planned
Parent: 023 Height and mask data model
Atomic: 023.012 Mask Resolution Lod
Domain: world
Owning kit candidate: `n:world:terrain-heightfield`

## Domain Implication

Define which masks need high resolution near the player and which can downsample in far rings.

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

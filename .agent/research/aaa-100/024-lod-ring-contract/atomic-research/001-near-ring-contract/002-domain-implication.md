# 024.001 Near Ring Contract - Domain Implication

Status: research-planned
Parent: 024 LOD ring contract
Atomic: 024.001 Near Ring Contract
Domain: world/render
Owning kit candidate: `n:render:terrain-lod-rings`

## Domain Implication

Define near-ring radius, triangle density, collision parity, prop density, and screenshot proof expectations.

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

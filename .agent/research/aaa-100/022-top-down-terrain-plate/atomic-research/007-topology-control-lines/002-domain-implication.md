# 022.007 Topology Control Lines - Domain Implication

Status: research-planned
Parent: 022 Top-down terrain plate
Atomic: 022.007 Topology Control Lines
Domain: world
Owning kit candidate: `n:goldrush:terrain-source-plate`

## Domain Implication

Draw ridge, wash, road, rail, cliff, and canyon control lines before generating any mesh triangles.

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

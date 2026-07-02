# 022.012 Multi Site Map Cuts - Domain Implication

Status: research-planned
Parent: 022 Top-down terrain plate
Atomic: 022.012 Multi Site Map Cuts
Domain: world
Owning kit candidate: `n:goldrush:terrain-source-plate`

## Domain Implication

Mark which plate regions belong to title backdrop, lobby backdrop, loading yard, gold field, and results replay.

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

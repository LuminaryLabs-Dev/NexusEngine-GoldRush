# 026.011 Collision Debug Overlay Policy - Domain Implication

Status: research-planned
Parent: 026 Collider parity
Atomic: 026.011 Collision Debug Overlay Policy
Domain: physics
Owning kit candidate: `n:physics:terrain-collider-parity`

## Domain Implication

Allow proof-only collision views but keep them out of the normal player UI.

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

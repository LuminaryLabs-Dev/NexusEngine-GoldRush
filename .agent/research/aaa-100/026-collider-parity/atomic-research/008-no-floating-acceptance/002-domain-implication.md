# 026.008 No Floating Acceptance - Domain Implication

Status: research-planned
Parent: 026 Collider parity
Atomic: 026.008 No Floating Acceptance
Domain: physics
Owning kit candidate: `n:physics:terrain-collider-parity`

## Domain Implication

Set exact max visible-to-physics vertical mismatch for player feet, props, train door, and cashout marker.

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

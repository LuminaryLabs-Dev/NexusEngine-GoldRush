# 026.007 Slope And Step Fixtures - Domain Implication

Status: research-planned
Parent: 026 Collider parity
Atomic: 026.007 Slope And Step Fixtures
Domain: physics
Owning kit candidate: `n:physics:terrain-collider-parity`

## Domain Implication

Create fixed test points for flat wash, mine ramp, ridge edge, town street, extraction pad, and mountain slope.

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

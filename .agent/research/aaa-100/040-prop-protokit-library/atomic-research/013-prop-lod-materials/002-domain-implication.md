# 040.013 Prop Lod Materials - Domain Implication

Status: research-planned
Parent: 040 Prop protokit library
Atomic: 040.013 Prop Lod Materials
Domain: content
Owning kit candidate: `n:goldrush:prop-protokit-library`

## Domain Implication

Define toon material roles and LOD roles so asset imports do not collapse into one flat primitive look.

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

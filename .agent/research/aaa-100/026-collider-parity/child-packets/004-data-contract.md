# 026 Collider parity - Data Contract

Status: active
Domain: physics
Owning kit candidate: `n:physics:terrain-collider-parity`

## Public Data Candidates
- `samplePoint`
- `visibleHeight`
- `colliderHeight`
- `raycastHit`
- `slope`
- `normal`
- `walkable`
- `mismatchTolerance`

## Public API Shape
- `snapshot()`: serializable state for proof, replay, and downstream kit consumption.
- `validate()`: invariant check for this domain.
- `reset(seedOrRevision)`: deterministic restart boundary.

## Internal API Shape
- Parse and normalize source data.
- Compute derived geometry, placement, route, physics, or proof data.
- Hide renderer, physics, and import details from gameplay-facing kits.

## Minimal Config
- Seed or revision id.
- Stable ids.
- Tuning thresholds.
- Feature flag if the system is behind staged rollout.

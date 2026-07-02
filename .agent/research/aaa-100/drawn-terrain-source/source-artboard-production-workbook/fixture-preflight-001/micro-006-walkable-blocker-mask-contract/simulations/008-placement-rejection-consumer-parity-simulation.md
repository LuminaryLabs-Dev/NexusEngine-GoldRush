# 008 - Placement Rejection Consumer Parity Simulation

Status: planned docs-only
Parent atom: `006-walkable-blocker-mask-contract`

## Implementation Simulation

1. Future code adds or loads `placementWalkabilityEcho` from the fixture.
2. The first validator checks that the field exists and is serializable.
3. Movement or placement consumes the query output and echoes fixture id, revision id, source field, class, and reason.
4. A negative fixture tries to pass by using height-only or visual-only terrain.
5. The validator rejects the negative fixture and marks dependent proof stale.

## Expected Failure

The first likely failure is a permissive default where terrain height implies walkability, even when the mask is missing, contradictory, or stale.

## Recovery Path

- Add a closed source field for `placementWalkabilityEcho`.
- Add consumer echo in movement and placement snapshots.
- Add a negative case that would have passed before the mask existed.
- Add stale-proof metadata when the fixture revision changes.

## Player View Implication

A player should understand that a mountain, cliff, hole, rail bed, wash edge, or town structure blocks or slows them because the world is authored, not because collision happened by accident.

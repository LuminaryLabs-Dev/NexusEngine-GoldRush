# 011 - Physics Render Scale Parity Simulation

Status: planned docs-only
Parent atom: `002-bounds-scale-and-origin`

## Simulated Implementation Pass

1. Add `consumerScaleEcho` to the future source fixture schema.
2. Add one valid fixture example and one invalid fixture example.
3. Add snapshot echo from `n:world:authored-terrain-mesh` and `n:goldrush:desert-world-map`.
4. Add one consumer echo from renderer, physics, placement, gameplay, LOD, or network scale depending on the field.
5. Mark proof stale if the source revision changes.

## Expected First Failure

The first failure should be a validator error proving that the player appears above, below, or inside terrain because visual and physical worlds disagree.

## Expected Passing Evidence

render mesh, collider, and raycast snapshots report identical bounds and scale.

## Deployment Risk

Local proof is not enough. Public proof must report the same fixture id, revision id, bounds, scale, and consumer echo before a scale-sensitive terrain pass can be treated as deployed.

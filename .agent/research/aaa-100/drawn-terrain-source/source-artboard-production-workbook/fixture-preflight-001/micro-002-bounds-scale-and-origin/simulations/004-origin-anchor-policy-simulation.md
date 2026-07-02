# 004 - Origin Anchor Policy Simulation

Status: planned docs-only
Parent atom: `002-bounds-scale-and-origin`

## Simulated Implementation Pass

1. Add `origin` to the future source fixture schema.
2. Add one valid fixture example and one invalid fixture example.
3. Add snapshot echo from `n:world:authored-terrain-mesh` and `n:goldrush:desert-world-map`.
4. Add one consumer echo from renderer, physics, placement, gameplay, LOD, or network scale depending on the field.
5. Mark proof stale if the source revision changes.

## Expected First Failure

The first failure should be a validator error proving that asset anchors and gameplay markers drift when the source artboard is moved.

## Expected Passing Evidence

spawn, rail, town, mine, and extraction anchors report the same origin reference.

## Deployment Risk

Local proof is not enough. Public proof must report the same fixture id, revision id, bounds, scale, and consumer echo before a scale-sensitive terrain pass can be treated as deployed.

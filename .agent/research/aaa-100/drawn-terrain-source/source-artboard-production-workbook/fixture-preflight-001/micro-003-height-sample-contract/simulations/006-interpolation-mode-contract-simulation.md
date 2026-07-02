# 006 - Interpolation Mode Contract Simulation

Status: planned docs-only
Parent atom: `003-height-sample-contract`

## Simulated Implementation Pass

1. Add `heightInterpolationMode` to the future source fixture schema or query result.
2. Add one valid fixture example and one invalid fixture example.
3. Add snapshot echo from `n:world:terrain-heightfield` and `n:goldrush:desert-terrain`.
4. Add one consumer echo from renderer, collider, raycast, movement, placement, gameplay, or public proof depending on the field.
5. Mark proof stale if the source height revision changes.

## Expected First Failure

The first failure should be a validator error proving that collider, renderer, and gameplay query different heights between sample points.

## Expected Passing Evidence

sampleHeight declares nearest, bilinear, barycentric, or fixed-mode interpolation.

## Deployment Risk

Local proof is not enough. Public proof must report the same fixture id, revision id, height sample context, and consumer echo before a height-sensitive terrain pass can be treated as deployed.

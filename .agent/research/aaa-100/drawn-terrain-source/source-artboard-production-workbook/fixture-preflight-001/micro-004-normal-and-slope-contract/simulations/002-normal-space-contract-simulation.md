# 002 - Normal Space Contract Simulation

Status: planned docs-only
Parent atom: `004-normal-and-slope-contract`

## Simulated Implementation Pass

1. Add `normalSpace` to the future source fixture schema or sampleGround result.
2. Add one valid fixture example and one invalid fixture example.
3. Add snapshot echo from `n:world:terrain-raycast` and `n:goldrush:player-grounding`.
4. Add one consumer echo from movement, placement, collider, renderer, gameplay, or public proof depending on the field.
5. Mark proof stale if the source normal or slope revision changes.

## Expected First Failure

The first failure should be a validator error proving that character grounding, prop alignment, and lighting use normals from different coordinate spaces.

## Expected Passing Evidence

snapshot states whether normals are source-local, fixture-local, or world-space and how consumers convert them.

## Deployment Risk

Local proof is not enough. Public proof must report the same fixture id, revision id, normal, slope, class, and consumer echo before a grounding-sensitive terrain pass can be treated as deployed.

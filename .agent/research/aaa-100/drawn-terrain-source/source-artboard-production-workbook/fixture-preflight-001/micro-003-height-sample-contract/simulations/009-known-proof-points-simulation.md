# 009 - Known Proof Points Simulation

Status: planned docs-only
Parent atom: `003-height-sample-contract`

## Simulated Implementation Pass

1. Add `heightProofPoints` to the future source fixture schema or query result.
2. Add one valid fixture example and one invalid fixture example.
3. Add snapshot echo from `n:world:terrain-heightfield` and `n:goldrush:desert-terrain`.
4. Add one consumer echo from renderer, collider, raycast, movement, placement, gameplay, or public proof depending on the field.
5. Mark proof stale if the source height revision changes.

## Expected First Failure

The first failure should be a validator error proving that height proof passes on arbitrary points while gameplay-critical locations remain unproven.

## Expected Passing Evidence

validator checks named spawn, route, mine, cashout, and blocker sample points.

## Deployment Risk

Local proof is not enough. Public proof must report the same fixture id, revision id, height sample context, and consumer echo before a height-sensitive terrain pass can be treated as deployed.

# Implementation Simulation

Status: active docs-only
Domain: production / validation

## Purpose

Simulate the first implementation pass without making code changes.

## Simulated Pass

1. Create a tiny source fixture for a desert slice.
2. Give it a revision id and world bounds.
3. Add height, normal, walkable, blocker, material, mine, gold, route, cover, and extraction layers.
4. Add chunk metadata for one near chunk and one far chunk.
5. Add placement anchors for a ridge, mine, gold seam, route marker, and extraction landmark.
6. Add a validator that rejects missing masks, inconsistent bounds, and stale revision ids.
7. Add a renderer consumer that reports the source revision before drawing any mesh.
8. Add a collider consumer that reports the same source revision before answering height queries.
9. Add a placement consumer that raycasts anchors onto source height.
10. Add a route proof that walks from spawn to mine to extraction without debug teleport.

## Expected First Failure

The first likely failure is consumer drift: one existing system will still use legacy procedural terrain math because it is convenient. That is acceptable only if the validator catches it and the packet remains active.

## Expected Second Failure

The second likely failure is visual thinness: a tiny source fixture may prove correctness without looking AAA. That is acceptable if the proof is labeled as source-fixture readiness, not final map quality.

## Success Definition

The first pass succeeds only if it proves:

- source revision id exists
- render/collider/placement/gameplay consumers match it
- source masks feed at least one route, mine, and extraction site
- no hidden helper is needed for the player route
- public proof labels the result narrowly

## Restart Rule

If the source schema changes, invalidate old terrain proof unless the old report can show matching revision id and schema version.


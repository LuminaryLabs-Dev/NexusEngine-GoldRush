# 002 - Blocker Mask Schema Audit

Status: planned docs-only
Parent atom: `006-walkable-blocker-mask-contract`

## Finding

`blockerMask` can appear complete if the runtime only proves a finite terrain height, a visible mesh, or a local movement rejection.

## Why It Matters

A 60-player extraction game needs the same walkable and blocked decisions for local movement, object placement, AI staging, combat routes, extraction landmarks, screenshots, simulator reports, and public proof.

## Future Bug Risk

- Players may float, snap, jitter, or collide with invisible blockers.
- Props may spawn inside mountains, cliffs, holes, or route blockers.
- Bot staging may claim 60-player readiness while using a different navigation surface.
- Public proof may pass with stale masks after a terrain source revision.

## Hardening

- Require source-owned `blockerMask`.
- Require negative fixture coverage.
- Require movement and placement consumer echo.
- Require stale-proof invalidation for local, simulator, screenshot, and public proof.

## Acceptance Gate

validator proves every blocker cell reports blocker id, class, reason, and source revision.

## Stop Condition

Stop if mountain, cliff, hole, ledge, water, structure, or out-of-bounds blockers can exist only as renderer geometry.

# 001 - Primary Route Schema Audit

Status: planned docs-only
Parent atom: `007-route-annotation-contract`

## Finding

`primaryRoute` can appear complete if the runtime only proves a visible trail, a target coordinate, or a local guidance arrow.

## Why It Matters

A 60-player extraction game needs the same route decisions for player guidance, bot staging, objective approach, cargo return, combat pressure, extraction paths, screenshots, simulator reports, and public proof.

## Future Bug Risk

- Players may follow unclear routes or miss objectives.
- Bots may stage through a different path graph than players.
- Cashout, mining, combat, and final rush may feel detached from the authored map.
- Public proof may pass with stale route data after a terrain source revision.

## Hardening

- Require source-owned `primaryRoute`.
- Require negative fixture coverage.
- Require player guidance and AI staging consumer echo.
- Require stale-proof invalidation for local, simulator, screenshot, and public proof.

## Acceptance Gate

validator proves the fixture exposes one source-owned primary prospecting route with id, points, corridor width, direction, and revision.

## Stop Condition

Stop if the main route can be inferred from a renderer ribbon or hardcoded guidance point.

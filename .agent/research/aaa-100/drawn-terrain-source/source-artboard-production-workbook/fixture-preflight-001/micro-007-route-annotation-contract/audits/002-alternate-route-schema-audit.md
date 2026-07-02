# 002 - Alternate Route Schema Audit

Status: planned docs-only
Parent atom: `007-route-annotation-contract`

## Finding

`alternateRoutes` can appear complete if the runtime only proves a visible trail, a target coordinate, or a local guidance arrow.

## Why It Matters

A 60-player extraction game needs the same route decisions for player guidance, bot staging, objective approach, cargo return, combat pressure, extraction paths, screenshots, simulator reports, and public proof.

## Future Bug Risk

- Players may follow unclear routes or miss objectives.
- Bots may stage through a different path graph than players.
- Cashout, mining, combat, and final rush may feel detached from the authored map.
- Public proof may pass with stale route data after a terrain source revision.

## Hardening

- Require source-owned `alternateRoutes`.
- Require negative fixture coverage.
- Require player guidance and AI staging consumer echo.
- Require stale-proof invalidation for local, simulator, screenshot, and public proof.

## Acceptance Gate

validator proves alternate routes have id, purpose, connection points, cost/risk tags, and source revision.

## Stop Condition

Stop if a map has only one safe path and every detour is accidental terrain wandering.

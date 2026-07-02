# 010 - AI Staging Route Parity Audit

Status: planned docs-only
Parent atom: `007-route-annotation-contract`

## Finding

`aiRouteStagingEcho` can appear complete if the runtime only proves a visible trail, a target coordinate, or a local guidance arrow.

## Why It Matters

A 60-player extraction game needs the same route decisions for player guidance, bot staging, objective approach, cargo return, combat pressure, extraction paths, screenshots, simulator reports, and public proof.

## Future Bug Risk

- Players may follow unclear routes or miss objectives.
- Bots may stage through a different path graph than players.
- Cashout, mining, combat, and final rush may feel detached from the authored map.
- Public proof may pass with stale route data after a terrain source revision.

## Hardening

- Require source-owned `aiRouteStagingEcho`.
- Require negative fixture coverage.
- Require player guidance and AI staging consumer echo.
- Require stale-proof invalidation for local, simulator, screenshot, and public proof.

## Acceptance Gate

bot staging route descriptors echo source route ids, segment ids, lane classes, and risk tags.

## Stop Condition

Stop if 60-player simulation can route bots through different data than the local player guidance path.

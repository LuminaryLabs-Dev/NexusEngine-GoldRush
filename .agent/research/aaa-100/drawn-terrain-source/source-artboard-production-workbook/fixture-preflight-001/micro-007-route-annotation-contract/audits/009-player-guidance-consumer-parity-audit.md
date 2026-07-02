# 009 - Player Guidance Consumer Parity Audit

Status: planned docs-only
Parent atom: `007-route-annotation-contract`

## Finding

`playerRouteGuidanceEcho` can appear complete if the runtime only proves a visible trail, a target coordinate, or a local guidance arrow.

## Why It Matters

A 60-player extraction game needs the same route decisions for player guidance, bot staging, objective approach, cargo return, combat pressure, extraction paths, screenshots, simulator reports, and public proof.

## Future Bug Risk

- Players may follow unclear routes or miss objectives.
- Bots may stage through a different path graph than players.
- Cashout, mining, combat, and final rush may feel detached from the authored map.
- Public proof may pass with stale route data after a terrain source revision.

## Hardening

- Require source-owned `playerRouteGuidanceEcho`.
- Require negative fixture coverage.
- Require player guidance and AI staging consumer echo.
- Require stale-proof invalidation for local, simulator, screenshot, and public proof.

## Acceptance Gate

player guidance snapshots echo route id, segment id, next node, lane class, route tags, and fixture revision.

## Stop Condition

Stop if player guidance can point somewhere without naming the source route it is following.

# Micro 007 - Route Annotation Contract

Status: active docs-only
Parent atom: `007-route-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Break the route annotation atom into micro-steps small enough for the first future terrain route, guidance, AI staging, and path-proof validator implementation. This packet is still docs-only.

## Rule

The terrain source must own primary routes, alternate routes, branches, return lanes, route tags, route proof points, and stale-proof behavior before player guidance, bot staging, combat pressure, extraction routes, or public proof can claim the map has authored traversal.

## Why This Matters

GoldRush needs a readable route web, not only a visible trail. Players should understand where to prospect, when to detour, how to reach mines and cashout sites, where return lanes are, and how risk changes along the path. Staging bots and future 60-player simulations must use the same source route revision as the local player.

## Files

- `micro-matrix.md`
- `research-matrix.md`
- `simulation-matrix.md`
- `audit-matrix.md`
- `micro/`
- `research/`
- `simulations/`
- `audits/`

## Exit Gate

This micro-runway is ready for future implementation when each micro-step names its source field, validator case, consumer echo, negative fixture case, player-facing implication, and stale-proof implication.

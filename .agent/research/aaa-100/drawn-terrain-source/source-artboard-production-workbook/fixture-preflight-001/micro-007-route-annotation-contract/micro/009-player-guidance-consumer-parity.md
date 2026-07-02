# 009 - Player Guidance Consumer Parity

Status: planned docs-only
Parent atom: `007-route-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/navigation/gameplay/control/staging/validation
Generic kit candidate: `n:world:route-annotations`
GoldRush kit candidate: `n:goldrush:prospector-routes`

## Purpose

Make `playerRouteGuidanceEcho` small enough for a future implementation pass.

## Source Field

- Required field: `playerRouteGuidanceEcho`.
- The route annotation kit must define or consume this field before player guidance, AI staging, gameplay routes, extraction routing, or proof consumers derive behavior from it.

## Validator Case

- Fail when `playerRouteGuidanceEcho` is missing, disconnected, unknown, contradictory, unversioned, non-source-owned, or silently inferred by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Player guidance must name the source route decision that directs the next move.
- AI staging must name the same source route revision when simulating future match scale.
- Gameplay and public proof must not use different route data from player-facing guidance.

## Required Proof

player guidance snapshots echo route id, segment id, next node, lane class, route tags, and fixture revision.

## Stop Condition

Stop if player guidance can point somewhere without naming the source route it is following.

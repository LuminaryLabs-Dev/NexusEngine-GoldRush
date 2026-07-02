# 006 - Route Cost Risk And Speed Tags

Status: planned docs-only
Parent atom: `007-route-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/navigation/gameplay/control/staging/validation
Generic kit candidate: `n:world:route-annotations`
GoldRush kit candidate: `n:goldrush:prospector-routes`

## Purpose

Make `routeCostRiskTags` small enough for a future implementation pass.

## Source Field

- Required field: `routeCostRiskTags`.
- The route annotation kit must define or consume this field before player guidance, AI staging, gameplay routes, extraction routing, or proof consumers derive behavior from it.

## Validator Case

- Fail when `routeCostRiskTags` is missing, disconnected, unknown, contradictory, unversioned, non-source-owned, or silently inferred by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Player guidance must name the source route decision that directs the next move.
- AI staging must name the same source route revision when simulating future match scale.
- Gameplay and public proof must not use different route data from player-facing guidance.

## Required Proof

route segments expose speed, risk, visibility, cargo, ambush, and extraction pressure tags as closed source-owned values.

## Stop Condition

Stop if final rush, cargo, ambush, and extraction systems cannot read route risk from the source fixture.

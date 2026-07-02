# 005 - Pressure Route Linkage

Status: planned docs-only
Parent atom: `009-cover-and-pressure-annotation-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/combat/render/gameplay/validation
Generic kit candidate: `n:world:cover-pressure-mask`
GoldRush kit candidate: `n:goldrush:ambush-pressure`

## Purpose

Make `pressureRouteLinks` small enough for a future implementation pass.

## Source Field

- Required field: `pressureRouteLinks`.
- The cover/pressure annotation kit must define or consume this field before renderer threat visuals, combat route guidance, ambush pressure, action surface, receipts, replay, results, bot staging, or proof consumers derive behavior from it.

## Validator Case

- Fail when `pressureRouteLinks` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Threat visuals must name the source cover/pressure decision that makes the combat state readable.
- Ambush pressure and combat route guidance must name the same source revision when triggering, guiding, resolving, or recording combat state.
- Receipts, replay, results, simulator proof, and public proof must not use different pressure data from player-facing threat readability.

## Required Proof

validator proves every pressure seed links to route ids, segment ids, approach lanes, retreat lanes, and fixture revision.

## Stop Condition

Stop if combat pressure can activate outside the authored traversal web.

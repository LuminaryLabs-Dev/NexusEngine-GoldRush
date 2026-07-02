# 007 - Rail Terrain Parity

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make rails, platforms, and train clearance match authored terrain height, slope, and blockers.

## Source Field

- Required field: `railTerrainParity`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `railTerrainParity` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Rail mesh, sleepers, platform, train body, wheel contact, collider clearance, route query, screenshots, and public proof must echo terrain parity ids.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

validator proves rail samples sit on terrain via source height/slope queries and expose clearance, grade, blocker, and revision checks.

## Stop Condition

Stop if rail mesh and terrain height derive independently or tracks float/bury at proof points.

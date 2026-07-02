# 012 - Rail Stale Proof

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make train and rail proof refresh whenever source rail annotations change.

## Source Field

- Required field: `railRevisionPolicy`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `railRevisionPolicy` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- All local, simulator, Playwright, video, and public proof artifacts must include rail source revision and fail when stale.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

source revision changes mark rail meshes, train motion, boarding locks, camera handoff, audio cues, screenshots, simulator proof, and public proof stale.

## Stop Condition

Stop if source rail changes do not force train, scene, camera, audio, and public proof refresh.

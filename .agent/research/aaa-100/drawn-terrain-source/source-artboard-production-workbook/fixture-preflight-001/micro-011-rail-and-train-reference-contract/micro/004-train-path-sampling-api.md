# 004 - Train Path Sampling Api

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make train position, tangent, normal, and progress come from one public route query.

## Source Field

- Required field: `trainPathQueryApi`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `trainPathQueryApi` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Train body, wheels, doors, camera, audio, boarding lock, debug snapshot, simulator proof, and public proof must use the same sampleRailAt output shape.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

sampleRailAt reports position, tangent, normal, bank, progress, segment id, station relation, speed band, and revision at named proof points.

## Stop Condition

Stop if train transforms use local curve math outside the route-spline kit.

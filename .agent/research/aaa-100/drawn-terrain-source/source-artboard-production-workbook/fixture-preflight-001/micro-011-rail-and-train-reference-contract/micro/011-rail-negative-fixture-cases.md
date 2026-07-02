# 011 - Rail Negative Fixture Cases

Status: planned docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: scene/world/render/physics/control/audio/validation
Generic kit candidate: `n:world:route-spline`
GoldRush kit candidate: `n:goldrush:train-loading`

## Purpose

Make invalid rail/train source data fail before scene flow, renderer, camera, audio, or proof can pass.

## Source Field

- Required field: `railNegativeCases`.
- The rail/train reference kit must define or consume this field before train transforms, rail meshes, platform props, boarding prompts, scene transitions, camera handoffs, audio cues, player locks, replay, simulator proof, or public proof derive behavior from it.

## Validator Case

- Fail when `railNegativeCases` is missing, duplicated, contradictory, unversioned, non-source-owned, renderer-inferred, helper-only, time-only, or silently replaced by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes fixture id, source id, direction label, and revision.

## Consumer Echo

- Every train, rail, camera, boarding, audio, and public proof test must include at least one failing source case that blocks fake train readiness.
- Train, rail, boarding, camera, audio, scene, simulator, and public proof consumers must not use different route data from player-facing train readability.

## Required Proof

validator fails reversed direction labels, broken splines, missing doors, off-terrain rails, impossible approaches, mismatched scene edges, and stale echoes.

## Stop Condition

Stop if validation only proves a train mesh or rail mesh exists.

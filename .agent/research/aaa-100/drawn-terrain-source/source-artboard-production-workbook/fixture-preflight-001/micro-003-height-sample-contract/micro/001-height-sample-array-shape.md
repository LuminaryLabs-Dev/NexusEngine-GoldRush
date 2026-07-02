# 001 - Height Sample Array Shape

Status: planned docs-only
Parent atom: `003-height-sample-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/physics/render/control/content/gameplay
Generic kit candidate: `n:world:terrain-heightfield`
GoldRush kit candidate: `n:goldrush:desert-terrain`

## Purpose

Make `heightSamples` small enough for a future implementation pass.

## Source Field

- Required field: `heightSamples`.
- The terrain heightfield kit must define this field before renderer, collider, movement, placement, or gameplay consumers can derive behavior from it.

## Validator Case

- Fail when `heightSamples` is missing, non-finite, contradictory, unversioned, or silently inferred by a consumer.
- Pass only when the source fixture exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Renderer must not become the height source.
- Collider and raycast consumers must not use a separate height function.
- Movement, placement, and gameplay zone consumers must report fixture id, revision id, sample context, and height when relevant.

## Required Proof

validator proves the fixture has a rectangular finite height array with declared width and height.

## Stop Condition

Stop if this micro-step can pass while terrain code accepts an irregular or empty height grid and fills gaps procedurally.

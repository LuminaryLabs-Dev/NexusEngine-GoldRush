# 005 - Cell Id And Sample Address

Status: planned docs-only
Parent atom: `003-height-sample-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/physics/render/control/content/gameplay
Generic kit candidate: `n:world:terrain-heightfield`
GoldRush kit candidate: `n:goldrush:desert-terrain`

## Purpose

Make `sourceCellId` small enough for a future implementation pass.

## Source Field

- Required field: `sourceCellId`.
- The terrain heightfield kit must define this field before renderer, collider, movement, placement, or gameplay consumers can derive behavior from it.

## Validator Case

- Fail when `sourceCellId` is missing, non-finite, contradictory, unversioned, or silently inferred by a consumer.
- Pass only when the source fixture exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Renderer must not become the height source.
- Collider and raycast consumers must not use a separate height function.
- Movement, placement, and gameplay zone consumers must report fixture id, revision id, sample context, and height when relevant.

## Required Proof

sampleHeight returns source cell id, sample index, and fractional coordinate context.

## Stop Condition

Stop if this micro-step can pass while debugging cannot identify which authored cell caused a bad player-footing or prop-placement result.

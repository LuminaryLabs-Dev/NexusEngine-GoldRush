# 001 - Normal Vector Shape

Status: planned docs-only
Parent atom: `004-normal-and-slope-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/control/physics/render/content/gameplay
Generic kit candidate: `n:world:terrain-raycast`
GoldRush kit candidate: `n:goldrush:player-grounding`

## Purpose

Make `normal` small enough for a future implementation pass.

## Source Field

- Required field: `normal`.
- The terrain raycast and player-grounding kits must define or consume this field before movement, placement, render, or gameplay consumers can derive behavior from it.

## Validator Case

- Fail when `normal` is missing, non-finite, contradictory, unversioned, non-source-owned, or silently inferred by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Movement must not use hidden slope thresholds.
- Placement must not align objects from renderer-only normals.
- Renderer may display normals, but renderer geometry must not become the source of gameplay normal or slope truth.

## Required Proof

sampleGround returns a three-component finite unit normal for every named walkable proof point.

## Stop Condition

Stop if this micro-step can pass while movement and placement accept malformed normals that only work in renderer lighting.

# 012 - Normal Slope Stale Proof

Status: planned docs-only
Parent atom: `004-normal-and-slope-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/control/physics/render/content/gameplay
Generic kit candidate: `n:world:terrain-raycast`
GoldRush kit candidate: `n:goldrush:player-grounding`

## Purpose

Make `normalSlopeRevisionPolicy` small enough for a future implementation pass.

## Source Field

- Required field: `normalSlopeRevisionPolicy`.
- The terrain raycast and player-grounding kits must define or consume this field before movement, placement, render, or gameplay consumers can derive behavior from it.

## Validator Case

- Fail when `normalSlopeRevisionPolicy` is missing, non-finite, contradictory, unversioned, non-source-owned, or silently inferred by a consumer.
- Pass only when the source fixture or query result exports the field and at least one consumer echoes it in snapshots.

## Consumer Echo

- Movement must not use hidden slope thresholds.
- Placement must not align objects from renderer-only normals.
- Renderer may display normals, but renderer geometry must not become the source of gameplay normal or slope truth.

## Required Proof

normal or slope changes mark movement, placement, collider, screenshot, and public proof stale.

## Stop Condition

Stop if this micro-step can pass while old movement or placement caches survive after source terrain slope changes.

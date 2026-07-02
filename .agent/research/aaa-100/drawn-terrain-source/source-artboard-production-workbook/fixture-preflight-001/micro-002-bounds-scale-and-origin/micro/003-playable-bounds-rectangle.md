# 003 - Playable Bounds Rectangle

Status: planned docs-only
Parent atom: `002-bounds-scale-and-origin`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/network/physics/render/gameplay
Generic kit candidate: `n:world:authored-terrain-mesh`
GoldRush kit candidate: `n:goldrush:desert-world-map`

## Purpose

Make `worldBounds` small enough for a future implementation pass.

## Source Field

- Required field: `worldBounds`.
- The owning terrain source kit must define this field before consumer kits can derive behavior from it.

## Validator Case

- Fail when `worldBounds` is missing, non-finite, contradictory, or silently inferred by a consumer.
- Pass only when the source fixture exports the field and consumers echo it in snapshots.

## Consumer Echo

- Renderer must not reinterpret scale locally.
- Collider and raycast consumers must not use a separate origin or scale.
- Placement and gameplay zone consumers must report the same fixture id, revision id, bounds, and scale context when relevant.

## Required Proof

inside and outside query points return deterministic accept or reject results.

## Stop Condition

Stop if this micro-step can pass while large terrain looks big but gameplay still happens in a tiny or undefined area.

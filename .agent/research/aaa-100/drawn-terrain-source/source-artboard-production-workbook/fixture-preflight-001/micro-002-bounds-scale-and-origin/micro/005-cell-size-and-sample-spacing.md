# 005 - Cell Size And Sample Spacing

Status: planned docs-only
Parent atom: `002-bounds-scale-and-origin`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/network/physics/render/gameplay
Generic kit candidate: `n:world:authored-terrain-mesh`
GoldRush kit candidate: `n:goldrush:desert-world-map`

## Purpose

Make `cellSize` small enough for a future implementation pass.

## Source Field

- Required field: `cellSize`.
- The owning terrain source kit must define this field before consumer kits can derive behavior from it.

## Validator Case

- Fail when `cellSize` is missing, non-finite, contradictory, or silently inferred by a consumer.
- Pass only when the source fixture exports the field and consumers echo it in snapshots.

## Consumer Echo

- Renderer must not reinterpret scale locally.
- Collider and raycast consumers must not use a separate origin or scale.
- Placement and gameplay zone consumers must report the same fixture id, revision id, bounds, and scale context when relevant.

## Required Proof

height, mask, LOD, and placement samples report shared cell size.

## Stop Condition

Stop if this micro-step can pass while terrain seams and raycast mismatch appear because consumers resample at different spacing.

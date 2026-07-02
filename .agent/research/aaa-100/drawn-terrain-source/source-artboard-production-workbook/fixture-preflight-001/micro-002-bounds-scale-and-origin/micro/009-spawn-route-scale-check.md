# 009 - Spawn Route Scale Check

Status: planned docs-only
Parent atom: `002-bounds-scale-and-origin`
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/network/physics/render/gameplay
Generic kit candidate: `n:world:authored-terrain-mesh`
GoldRush kit candidate: `n:goldrush:desert-world-map`

## Purpose

Make `scaleProofAnchors` small enough for a future implementation pass.

## Source Field

- Required field: `scaleProofAnchors`.
- The owning terrain source kit must define this field before consumer kits can derive behavior from it.

## Validator Case

- Fail when `scaleProofAnchors` is missing, non-finite, contradictory, or silently inferred by a consumer.
- Pass only when the source fixture exports the field and consumers echo it in snapshots.

## Consumer Echo

- Renderer must not reinterpret scale locally.
- Collider and raycast consumers must not use a separate origin or scale.
- Placement and gameplay zone consumers must report the same fixture id, revision id, bounds, and scale context when relevant.

## Required Proof

spawn-to-mine, mine-to-cashout, and town-to-rail distances are within named budgets.

## Stop Condition

Stop if this micro-step can pass while the map is technically large but traversal pacing is not battle-royale readable.

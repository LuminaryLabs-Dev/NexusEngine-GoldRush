# 001 - World Coordinate System Audit

Status: planned docs-only
Parent atom: `002-bounds-scale-and-origin`

## Finding

The bounds, scale, and origin pass can fake completion if `coordinateSystem` exists but consumers do not use it.

## Why It Matters

renderer, physics, placement, and gameplay interpret positions in different axes.

## Long-Term Impact

- Terrain fidelity work becomes hard to debug because screenshots, colliders, and route markers describe different worlds.
- Player movement and camera proof can pass locally while public or future map revisions drift.
- 60-player staging can make false density claims if map size and partition scale do not share a source field.

## Hardening

- Require source fixture schema proof.
- Require negative validator proof.
- Require at least one consumer echo.
- Require stale-proof behavior after source revision changes.
- Require human-view or state proof that can be compared between local and public builds when this becomes runtime work.

## Audit Rewrite

Do not mark this micro-step resolved until snapshot names handedness, axes, and up vector before any consumer samples terrain and the validator catches the opposite failure.

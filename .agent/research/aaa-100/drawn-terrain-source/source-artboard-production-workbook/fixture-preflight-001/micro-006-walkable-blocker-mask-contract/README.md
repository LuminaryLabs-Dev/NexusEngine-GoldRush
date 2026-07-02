# Micro 006 - Walkable Blocker Mask Contract

Status: active docs-only
Parent atom: `006-walkable-blocker-mask-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Break the walkable and blocker mask atom into micro-steps small enough for the first future terrain navigation, grounding, and placement validator implementation. This packet is still docs-only.

## Rule

The terrain source must own walkable and blocker identity before movement, placement, AI staging, camera collision, object protokit placement, or public proof can claim the player is standing on a real authored map.

## Why This Matters

GoldRush currently has useful height, raycast, and collider scaffolding. That still is not enough for a 60-player extraction game. The map must state where players can walk, where they must detour, why mountains block them, where object anchors are rejected, and how staging bots and public proof know they are using the same source revision.

## Files

- `micro-matrix.md`
- `research-matrix.md`
- `simulation-matrix.md`
- `audit-matrix.md`
- `micro/`
- `research/`
- `simulations/`
- `audits/`

## Exit Gate

This micro-runway is ready for future implementation when each micro-step names its source field, validator case, consumer echo, negative fixture case, player-facing implication, and stale-proof implication.

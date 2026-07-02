# 008 - Drift Negative Case Research

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Research Question

What source identity or terrain-production signal constrains this micro-step?

## Source Signals

- Unreal Landscape Technical Guide: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
  - GoldRush use: Height, scale, and component decisions need explicit source contracts before consumers derive terrain.
- Unity Heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
  - GoldRush use: Terrain elevation should be source data that downstream systems sample, not duplicated local math.
- Unity Terrain Colliders: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
  - GoldRush use: Collision parity depends on matching terrain data, shape, position, and scale.

## Translation

- Data contract: consumer fixture or revision mismatch failure cases.
- Proof contract: validator fails when any consumer echoes a mismatched id or revision.
- Risk constrained: source drift is discovered only from visual bugs.

## Rule

Convert the reference into a validator, snapshot, event, stale-proof flag, or restart field.

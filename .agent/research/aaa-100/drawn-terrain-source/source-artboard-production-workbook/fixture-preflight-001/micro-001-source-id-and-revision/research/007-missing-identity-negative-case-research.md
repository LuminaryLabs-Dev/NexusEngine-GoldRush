# 007 - Missing Identity Negative Case Research

Status: active docs-only
Parent atom: `001-source-id-and-revision`

## Research Question

What source identity or terrain-production signal constrains this micro-step?

## Source Signals

- PUBG official site: https://pubg.com/en/
  - GoldRush use: Large BR loops depend on land, loot, survive, map identity, and repeatable match state.
- Unreal Landscape Technical Guide: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
  - GoldRush use: Height, scale, and component decisions need explicit source contracts before consumers derive terrain.
- Unity Heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
  - GoldRush use: Terrain elevation should be source data that downstream systems sample, not duplicated local math.

## Translation

- Data contract: fixture missing id or revision failure cases.
- Proof contract: validator fails missing fixtureId or missing revisionId before any consumer runs.
- Risk constrained: bad source can enter runtime before the first gate.

## Rule

Convert the reference into a validator, snapshot, event, stale-proof flag, or restart field.

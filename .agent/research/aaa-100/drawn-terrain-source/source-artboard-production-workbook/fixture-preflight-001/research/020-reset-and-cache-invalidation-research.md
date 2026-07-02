# 020 - Reset And Cache Invalidation Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: runtime/versioning

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- PUBG maps: https://pubg.com/en/game-info/maps/erangel
  - GoldRush use: Large BR maps need towns, terrain variety, roads, and named landmarks.
- GitHub game engines collection: https://github.com/collections/game-engines
  - GoldRush use: Use engine-feature breadth as a checklist while keeping GoldRush kit-owned, not engine-building.
- Unreal Landscape Technical Guide: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
  - GoldRush use: Treat height, scale, and component layout as explicit source contracts.
- Unity Heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
  - GoldRush use: Height is source data before it is render geometry.

## Domain Translation

- The atom should remain kit-owned by `n:runtime:snapshot` and `n:goldrush:reality-status`.
- The data contract is revision reset, derived cache ids, stale proof flags.
- The proof contract is revision change invalidates render, physics, placement, gameplay, and proof caches.
- The main risk is new source data mixes with old derived state.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

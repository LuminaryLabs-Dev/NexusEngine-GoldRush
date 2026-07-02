# 010 - Cashout And Extraction Annotation Contract Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: gameplay/match

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

- The atom should remain kit-owned by `n:world:extraction-zone-mask` and `n:goldrush:cashout-sites`.
- The data contract is cashout marker, extraction radius, return route.
- The proof contract is cashout marker and receipt can report annotation id.
- The main risk is extraction works structurally but not as a map-authored destination.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

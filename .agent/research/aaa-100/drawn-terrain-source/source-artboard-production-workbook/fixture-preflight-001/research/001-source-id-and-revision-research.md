# 001 - Source Id And Revision Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/runtime

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- GitHub game engines collection: https://github.com/collections/game-engines
  - GoldRush use: Use engine-feature breadth as a checklist while keeping GoldRush kit-owned, not engine-building.
- Unreal Landscape Technical Guide: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
  - GoldRush use: Treat height, scale, and component layout as explicit source contracts.
- Unity Heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
  - GoldRush use: Height is source data before it is render geometry.
- Unity Terrain Colliders: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
  - GoldRush use: Collider parity depends on shared terrain data, shape, position, and scale.

## Domain Translation

- The atom should remain kit-owned by `n:world:authored-terrain-mesh` and `n:goldrush:desert-world-map`.
- The data contract is fixtureId, revisionId, revisionReason.
- The proof contract is all consumers echo the same fixtureId and revisionId.
- The main risk is silent source mutation leaves stale caches active.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

# 002 - Bounds Scale And Origin Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/network

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- Unreal Landscape Technical Guide: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
  - GoldRush use: Treat height, scale, and component layout as explicit source contracts.
- Unity Heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
  - GoldRush use: Height is source data before it is render geometry.
- Unity Terrain Colliders: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
  - GoldRush use: Collider parity depends on shared terrain data, shape, position, and scale.
- Unity Terrain Layers: https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
  - GoldRush use: Material layers should carry surface identity for render, audio, VFX, and placement.

## Domain Translation

- The atom should remain kit-owned by `n:world:authored-terrain-mesh` and `n:goldrush:desert-world-map`.
- The data contract is worldBounds, origin, unitScale, cellSize.
- The proof contract is queries reject points outside bounds and report unit scale.
- The main risk is map scale drifts from player movement and 60-player density assumptions.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

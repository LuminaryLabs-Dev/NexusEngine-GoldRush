# 012 - Asset Anchor Family Contract Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: content/world

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

- The atom should remain kit-owned by `n:world:placement-anchors` and `n:goldrush:desert-asset-family-protokits`.
- The data contract is asset anchor ids, family, mask, transform hints.
- The proof contract is first prop placement reports anchor id and raycast hit.
- The main risk is procedural objects remain scatter instead of kit-owned map content.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

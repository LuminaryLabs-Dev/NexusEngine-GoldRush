# 003 - Height Sample Contract Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/physics

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- Unity Heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
  - GoldRush use: Height is source data before it is render geometry.
- Unity Terrain Colliders: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
  - GoldRush use: Collider parity depends on shared terrain data, shape, position, and scale.
- Unity Terrain Layers: https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
  - GoldRush use: Material layers should carry surface identity for render, audio, VFX, and placement.
- SideFX Terrain Height Fields: https://www.sidefx.com/docs/houdini/unity/terrain/basics.html
  - GoldRush use: Heightfield size and grid spacing must be understood before downstream conversion.

## Domain Translation

- The atom should remain kit-owned by `n:world:terrain-heightfield` and `n:goldrush:desert-terrain`.
- The data contract is height samples and source cell ids.
- The proof contract is sampleHeight returns finite values from the fixture.
- The main risk is render and collider derive height from different math.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

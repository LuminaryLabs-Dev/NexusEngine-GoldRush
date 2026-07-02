# 014 - LOD Cell Contract Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: render/performance

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- Unity Terrain Colliders: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
  - GoldRush use: Collider parity depends on shared terrain data, shape, position, and scale.
- Unity Terrain Layers: https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
  - GoldRush use: Material layers should carry surface identity for render, audio, VFX, and placement.
- SideFX Terrain Height Fields: https://www.sidefx.com/docs/houdini/unity/terrain/basics.html
  - GoldRush use: Heightfield size and grid spacing must be understood before downstream conversion.
- Apex Legends features: https://www.ea.com/games/apex-legends/apex-legends/features
  - GoldRush use: 60-person BR, maps, modes, and squads are product-shape constraints.

## Domain Translation

- The atom should remain kit-owned by `n:world:terrain-chunks` and `n:goldrush:gold-field-lod`.
- The data contract is near, mid, far, horizon cell ids.
- The proof contract is active camera/player position resolves expected LOD cells.
- The main risk is large terrain pops, seams, or overdraws without source-owned cells.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

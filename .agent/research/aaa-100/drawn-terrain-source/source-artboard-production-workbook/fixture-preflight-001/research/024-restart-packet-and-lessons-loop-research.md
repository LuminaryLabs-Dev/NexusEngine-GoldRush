# 024 - Restart Packet And Lessons Loop Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: production

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

- The atom should remain kit-owned by `n:runtime:validation` and `n:goldrush:restart-policy`.
- The data contract is restart reason, stale proof list, lesson update.
- The proof contract is source revision changes create a restart packet and update lesson only when behavior changes.
- The main risk is new terrain knowledge is lost between passes.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

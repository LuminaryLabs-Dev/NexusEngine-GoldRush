# 015 - Render Consumer Revision Parity Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: render/runtime

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- Unity Terrain Layers: https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
  - GoldRush use: Material layers should carry surface identity for render, audio, VFX, and placement.
- SideFX Terrain Height Fields: https://www.sidefx.com/docs/houdini/unity/terrain/basics.html
  - GoldRush use: Heightfield size and grid spacing must be understood before downstream conversion.
- Apex Legends features: https://www.ea.com/games/apex-legends/apex-legends/features
  - GoldRush use: 60-person BR, maps, modes, and squads are product-shape constraints.
- Apex Legends FAQ: https://www.ea.com/games/apex-legends/about/frequently-asked-questions
  - GoldRush use: Private-match and staging claims must be labeled separately from full BR proof.

## Domain Translation

- The atom should remain kit-owned by `n:render:three-scene` and `n:goldrush:3d-scene-renderer`.
- The data contract is render chunk source revision and LOD cell id.
- The proof contract is render snapshot reports fixture and revision.
- The main risk is visual mesh claims source parity while using local terrain math.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

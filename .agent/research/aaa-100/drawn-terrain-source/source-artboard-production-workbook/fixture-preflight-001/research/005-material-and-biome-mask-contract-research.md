# 005 - Material And Biome Mask Contract Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: world/render/audio

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

- The atom should remain kit-owned by `n:world:terrain-material-mask` and `n:goldrush:desert-materials`.
- The data contract is material and biome masks.
- The proof contract is render, audio, VFX, and placement can name material and biome tags.
- The main risk is terrain looks varied but gameplay and audio ignore surface identity.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

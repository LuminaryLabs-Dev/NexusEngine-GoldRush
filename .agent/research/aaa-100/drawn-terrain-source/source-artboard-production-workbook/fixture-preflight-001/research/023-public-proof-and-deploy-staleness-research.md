# 023 - Public Proof And Deploy Staleness Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: release/validation

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

- The atom should remain kit-owned by `n:runtime:validation` and `n:goldrush:public-proof`.
- The data contract is public fixture revision and artifact ids.
- The proof contract is public runtime reports same fixture revision as local proof.
- The main risk is local source proof is mistaken for deployed behavior.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

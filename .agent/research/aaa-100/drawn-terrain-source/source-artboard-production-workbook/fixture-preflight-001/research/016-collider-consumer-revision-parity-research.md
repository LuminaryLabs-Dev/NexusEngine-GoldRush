# 016 - Collider Consumer Revision Parity Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: physics/runtime

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- SideFX Terrain Height Fields: https://www.sidefx.com/docs/houdini/unity/terrain/basics.html
  - GoldRush use: Heightfield size and grid spacing must be understood before downstream conversion.
- Apex Legends features: https://www.ea.com/games/apex-legends/apex-legends/features
  - GoldRush use: 60-person BR, maps, modes, and squads are product-shape constraints.
- Apex Legends FAQ: https://www.ea.com/games/apex-legends/about/frequently-asked-questions
  - GoldRush use: Private-match and staging claims must be labeled separately from full BR proof.
- PUBG official site: https://pubg.com/en/
  - GoldRush use: Land, loot, survive is a useful BR loop lens for map/source proof.

## Domain Translation

- The atom should remain kit-owned by `n:physics:collider` and `n:goldrush:terrain-physics`.
- The data contract is collider source revision and sample parity report.
- The proof contract is collider samples match fixture height at test points.
- The main risk is player walks on invisible or mismatched terrain.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

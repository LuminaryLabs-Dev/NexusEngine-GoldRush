# 021 - CLI Validator Negative Cases Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: validation

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

- The atom should remain kit-owned by `n:runtime:validation` and `n:goldrush:reality-status`.
- The data contract is missing fields, invalid masks, drift, stale consumers.
- The proof contract is validator fails bad fixtures before passing the good fixture.
- The main risk is validation becomes an existence check instead of a source-parity gate.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

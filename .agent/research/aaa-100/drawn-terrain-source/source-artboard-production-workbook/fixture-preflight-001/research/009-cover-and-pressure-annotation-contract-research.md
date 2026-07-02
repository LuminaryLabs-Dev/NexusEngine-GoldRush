# 009 - Cover And Pressure Annotation Contract Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: combat/world

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- PUBG official site: https://pubg.com/en/
  - GoldRush use: Land, loot, survive is a useful BR loop lens for map/source proof.
- PUBG maps: https://pubg.com/en/game-info/maps/erangel
  - GoldRush use: Large BR maps need towns, terrain variety, roads, and named landmarks.
- GitHub game engines collection: https://github.com/collections/game-engines
  - GoldRush use: Use engine-feature breadth as a checklist while keeping GoldRush kit-owned, not engine-building.
- Unreal Landscape Technical Guide: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
  - GoldRush use: Treat height, scale, and component layout as explicit source contracts.

## Domain Translation

- The atom should remain kit-owned by `n:world:cover-pressure-mask` and `n:goldrush:ambush-pressure`.
- The data contract is cover pockets, threat lanes, pressure seeds.
- The proof contract is combat proof can name source cover and pressure ids.
- The main risk is combat pressure spawns without readable counterplay.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

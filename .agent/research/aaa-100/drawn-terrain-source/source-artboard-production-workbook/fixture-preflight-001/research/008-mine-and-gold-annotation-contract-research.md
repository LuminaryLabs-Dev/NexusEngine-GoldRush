# 008 - Mine And Gold Annotation Contract Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: gameplay/world

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- Apex Legends FAQ: https://www.ea.com/games/apex-legends/about/frequently-asked-questions
  - GoldRush use: Private-match and staging claims must be labeled separately from full BR proof.
- PUBG official site: https://pubg.com/en/
  - GoldRush use: Land, loot, survive is a useful BR loop lens for map/source proof.
- PUBG maps: https://pubg.com/en/game-info/maps/erangel
  - GoldRush use: Large BR maps need towns, terrain variety, roads, and named landmarks.
- GitHub game engines collection: https://github.com/collections/game-engines
  - GoldRush use: Use engine-feature breadth as a checklist while keeping GoldRush kit-owned, not engine-building.

## Domain Translation

- The atom should remain kit-owned by `n:world:resource-annotations` and `n:goldrush:gold-seams`.
- The data contract is mine site and gold seam annotations.
- The proof contract is mining marker can be derived from annotation id.
- The main risk is mining remains a hardcoded marker detached from authored terrain.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

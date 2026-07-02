# 018 - Gameplay Zone Consumer Parity Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: gameplay/runtime

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

- The atom should remain kit-owned by `n:gameplay:interaction-hold` and `n:goldrush:mine-hold-action`.
- The data contract is zone annotation ids used by actions.
- The proof contract is mine and cashout actions report source annotation ids.
- The main risk is receipts prove actions that were not authored into the map.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

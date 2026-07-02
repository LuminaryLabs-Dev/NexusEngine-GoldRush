# 017 - Movement Grounding Consumer Parity Research

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`
Domain: control/physics

## Research Question

What external terrain, game-architecture, battle-royale, or staging signal constrains this atom before implementation?

## Source Signals

- Apex Legends features: https://www.ea.com/games/apex-legends/apex-legends/features
  - GoldRush use: 60-person BR, maps, modes, and squads are product-shape constraints.
- Apex Legends FAQ: https://www.ea.com/games/apex-legends/about/frequently-asked-questions
  - GoldRush use: Private-match and staging claims must be labeled separately from full BR proof.
- PUBG official site: https://pubg.com/en/
  - GoldRush use: Land, loot, survive is a useful BR loop lens for map/source proof.
- PUBG maps: https://pubg.com/en/game-info/maps/erangel
  - GoldRush use: Large BR maps need towns, terrain variety, roads, and named landmarks.

## Domain Translation

- The atom should remain kit-owned by `n:control:character-movement` and `n:goldrush:prospector-movement`.
- The data contract is ground hit, slope, walkable, revision id.
- The proof contract is local player ground snapshot names fixture revision.
- The main risk is camera and player pulse because movement owns different ground truth.

## Implementation Constraint

Do not use these references as visual taste only. Convert them into source fields, consumer snapshots, validation gates, or human-view proof labels.

# Reference Notes

Status: active docs-only
Checked: 2026-07-01

## Sources

- GitHub Game Engines collection: https://github.com/collections/game-engines
- Unreal World Partition: https://dev.epicgames.com/documentation/unreal-engine/world-partition-in-unreal-engine
- Unreal Landscape Technical Guide: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
- Unity Terrain Layers: https://docs.unity3d.com/6000.2/Documentation/Manual/class-TerrainLayer.html
- Unity Heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
- SideFX Heightfields: https://www.sidefx.com/docs/houdini/model/heightfields.html
- SideFX Houdini Engine terrain basics: https://www.sidefx.com/docs/houdini/unity/terrain/basics.html
- EA Apex Battle Royale: https://www.ea.com/games/apex-legends/apex-legends/apex-legends-modes-hub/battle-royale
- EA Apex maps: https://www.ea.com/games/apex-legends/apex-legends/maps-hub

## Translation To GoldRush

- World Partition suggests source cells and streaming discipline; GoldRush should use the idea as a kit contract, not build a general engine.
- Landscape and heightmap docs reinforce height source, component sizing, and terrain-data discipline; GoldRush should keep source dimensions explicit.
- Terrain layers and Houdini heightfields reinforce mask layers as first-class data; GoldRush should use masks for material, placement, and gameplay, not only color.
- Apex battle royale references reinforce 60-player scale, massive maps, squads, loot/value movement, and closing pressure; GoldRush should translate that into crews, gold value, extraction routes, and final-rush pressure.

## Research Risk

These references should not turn GoldRush into Unreal, Unity, or a general engine. They are a checklist for missing product and terrain architecture ideas.

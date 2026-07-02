# Reference Research

Status: active docs-only
Checked: 2026-07-01

## Sources

- GitHub Game Engines collection: https://github.com/collections/game-engines
- Epic World Partition: https://dev.epicgames.com/documentation/unreal-engine/world-partition-in-unreal-engine
- Epic World Partition HLOD: https://dev.epicgames.com/documentation/unreal-engine/world-partition---hierarchical-level-of-detail-in-unreal-engine
- Unity Heightmaps manual: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
- Unity Terrain settings manual: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-OtherSettings.html
- EA Apex Battle Royale page: https://www.ea.com/games/apex-legends/apex-legends/apex-legends-modes-hub/battle-royale
- EA Apex modes hub: https://www.ea.com/games/apex-legends/apex-legends/apex-legends-modes-hub
- EA Apex maps hub: https://www.ea.com/games/apex-legends/apex-legends/maps-hub

## Extracted Signals

- Open-world systems use cells, streaming sources, and HLOD to keep large worlds visible without loading everything at full detail. GoldRush should copy the architectural idea, not the engine.
- Heightmap-style terrain is useful because one source can feed visual vertices, collider samples, masks, and query APIs. GoldRush needs the source-data discipline, not Unity Terrain.
- Apex's public materials reinforce the high-level product target: 60-player matches, massive maps, squads, loot/value decisions, and closing pressure. GoldRush should translate that into crews, claims, gold value, extraction pressure, and a final-rush system.
- Game-engine collections are useful as a missing-feature checklist: scene loading, asset pipeline, physics, animation, audio, networking, tools, profiling, debugging, and deploy proof. GoldRush should remain a game, but its kits need those domains.

## GoldRush Translation

- Use source cells instead of ad hoc terrain chunks.
- Use HLOD-like horizon simplification for mesas and distant mine/town silhouettes.
- Use height/mask source data for renderer, collider, placement, route, and gameplay.
- Use battle-royale references to validate map scale, squad staging, route pressure, and player clarity.

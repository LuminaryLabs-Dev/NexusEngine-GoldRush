# Reference Notes

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Translate current external reference signals into constraints for the tiny GoldRush source fixture.

## Source Signals

| Source | Useful signal | GoldRush constraint |
| --- | --- | --- |
| GitHub game engines collection | Mature game stacks separate rendering, physics, asset flow, input, tools, and validation concerns. | Do not make a new engine, but make the terrain fixture feed domain kits instead of renderer-only code. |
| Unreal Landscape Technical Guide | Landscape height values, scale, and import precision must be treated as explicit technical contracts. | The fixture needs source bounds, scale, height samples, and revision identity before terrain import. |
| Unity Heightmaps | Heightmaps are a source representation for terrain elevation. | The fixture should treat height as data first, not geometry first. |
| Unity Terrain Colliders | Terrain collider quality depends on matching visible terrain data, shape, position, and scale. | Collider parity must use the same fixture revision as render and movement. |
| Unity Terrain Layers | Terrain material layers carry surface identity. | Material and biome masks should drive render, audio, VFX, and asset placement. |
| SideFX Heightfields | Terrain source can be layered and processed into derived outputs. | Drawn artboard layers should produce render chunks, masks, LOD, and proof data. |
| Apex Legends official feature pages | Modern battle royale relies on 60-person matches, squads, modes, maps, and evolving live content. | GoldRush must keep 60-player scale, squad readability, map landmarks, and replayable match structure visible in source data. |
| Apex official matchmaking/private-match notes | Full battle royale scale and smaller practice/private contexts are separate product shapes. | GoldRush must label single-player staging, simulated scale, and live 60-player proof separately. |

## Reference URLs

- https://github.com/collections/game-engines
- https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
- https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
- https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
- https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
- https://www.sidefx.com/docs/houdini/model/heightfields.html
- https://www.ea.com/games/apex-legends/apex-legends/features
- https://www.ea.com/games/apex-legends/about/frequently-asked-questions

## Stop Condition

Stop if references are used only as visual inspiration. The fixture must turn them into source fields, consumer boundaries, scale labels, and proof gates.

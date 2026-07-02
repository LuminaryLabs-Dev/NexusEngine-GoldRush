# Reference Signals

Status: active docs-only
Domain: research / architecture / product

## Purpose

Capture the external signals that support the map blueprint.

## Matrix

| Source | Signal | GoldRush implication |
| --- | --- | --- |
| Unreal World Partition | Large worlds can be represented as one persistent world subdivided into streamable grid cells around streaming sources. | GoldRush should keep one desert source revision and derive active terrain cells from player, train, proof, and future partition sources. |
| Unreal HLOD | Distant, non-interactive world content can use grouped proxy meshes and materials to reduce draw cost while keeping distant features visible. | GoldRush far mesas and horizon terrain should be proxy/HLOD-style cells, not full interactive terrain. |
| Unreal Data Layers and PCG | Generated actors can be assigned to world-partition data/HLOD layers, and overused runtime layers can hurt performance. | GoldRush procedural asset families should be grouped by source layer and budgeted per cell. |
| Unity heightmaps | Terrain height can be an editable/importable source asset, with height values defining terrain shape. | GoldRush should treat height, masks, and source layers as authored data before deriving render or collider output. |
| Unity terrain layers | Terrain materials are reusable layer assets and too many layers can affect performance. | GoldRush toon terrain bands should be mask-driven and budgeted, not unlimited material variants. |
| Three.js LOD | LOD levels switch by distance and hysteresis can reduce flicker at boundaries. | GoldRush terrain/asset LOD should include no-pop proof and transition bands during normal walking. |
| Apex maps and modes | Apex uses named maps, 60-player private matches, bot modes, POI rotations, map toys, and live map tuning to shape readability and progression boundaries. | GoldRush needs named POIs, staging-vs-live proof labels, 60-player readiness boundaries, and careful route-tool tuning. |
| GitHub game engines collection | Engine architecture commonly separates rendering, assets, runtime, tooling, platform, and editor concerns. | GoldRush should borrow separation of concerns without becoming a new engine: source data, kits, renderer consumers, validators, and proof tools. |

## Research Rule

Use these as architecture signals only. Do not copy mechanics, map content, assets, or proprietary presentation from any reference game.


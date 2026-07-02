# Reference Signals

Status: active docs-only
Domain: research / architecture

## Purpose

Record the external architecture signals used to shape the source-first terrain gate.

## Sources

| Source | Signal | GoldRush implication |
| --- | --- | --- |
| Unreal World Partition | Large worlds are treated as one persistent world subdivided into streamable grid cells loaded by streaming sources. | GoldRush should keep one terrain source revision and derive loaded chunks from player or proof streaming context. |
| Unreal Landscape Technical Guide | Landscape components act as rendering, visibility, and collision units, with component sizing tied to performance tradeoffs. | GoldRush LOD chunks should be data-contract units for render, collision, and proof, not renderer-only batches. |
| Unity heightmaps | Terrain height is represented by heightmap values, and import/export workflows make height data an editable source asset. | GoldRush should make its drawn terrain source editable data before render/collider consumers derive from it. |
| Three.js LOD | LOD swaps objects at distances and supports hysteresis to reduce boundary flicker. | GoldRush needs explicit near/mid/far terrain objects and no-pop proof at normal player movement speeds. |
| GitHub game engines collection | Engines repeatedly separate renderer, assets, runtime, tooling, and platform support as major architecture surfaces. | GoldRush should not become a new engine, but it should borrow the separation: source data, runtime kits, renderer consumers, validators, proof tooling. |

## Working Conclusion

The source-first terrain gate is not a new engine plan. It is a safety layer that makes the existing GoldRush kit architecture behave like a real game production pipeline:

- source data first
- consumers second
- proof third
- visual expansion fourth


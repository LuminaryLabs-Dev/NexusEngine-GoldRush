# Source Data Contract

Status: active docs-only

## Minimal Source

The first fixture should be small, but complete. It needs the same fields the final map needs at reduced scale.

## Required Fields

| Field | Purpose | Consumer |
| --- | --- | --- |
| `revisionId` | Stable source identity. | all kits |
| `bounds` | World size and origin. | camera, physics, LOD, network |
| `height` | Terrain elevation. | render, collider, grounding |
| `normal` | Surface direction. | lighting, grounding, placement |
| `slope` | Walkability and cover placement. | movement, bots, placement |
| `materialMask` | Sand, clay, rock, rail bed, wash. | render, audio, VFX |
| `walkableMask` | Player and bot movement. | movement, route proof |
| `blockerMask` | Mountains, cliffs, walls. | physics, camera, bots |
| `gameplayMasks` | Gold, extraction, combat, route, pressure. | gameplay kits |
| `anchors` | Object protokit placement. | content/render |
| `proofSamples` | Regression points. | validation |

## Data Rule

Config stays minimal. The source contains map facts. Gameplay systems may tune values, but may not invent terrain, object, route, or zone facts outside the source without recording a derived descriptor.

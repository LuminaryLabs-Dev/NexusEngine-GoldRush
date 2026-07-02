# Layer Stack

Status: active docs-only

## Required Layers

| Layer | Meaning | Primary consumer |
| --- | --- | --- |
| `height` | Terrain elevation source. | render, collider, raycast |
| `normal` | Surface direction. | lighting, placement, grounding |
| `slope` | Walkability and placement constraint. | movement, bots, physics |
| `material` | Sand, clay, rock, rail bed, wood deck, mine floor. | render, audio, VFX |
| `biome` | Wash, mesa, basin, town shelf, mine shelf, rail corridor. | object placement |
| `walkable` | Player and bot traversal. | movement, route proof |
| `blocker` | Cliff, mountain, hard barrier, camera collision. | physics, camera, bot routes |
| `route` | Main paths, shortcuts, risky cuts, tutorial route. | guidance, bots, proof |
| `rail` | Train path, station, crossing, rail bed. | first sequence, setpieces |
| `town` | Settlement shelf and prop zones. | asset families, cover |
| `mine` | Mine mouth, cave shelf, gold seams, tailings. | mining, assets |
| `gold` | Mineable zones, high-value seams, depleted zones. | economy, extraction |
| `cover` | Rocks, buildings, ridges, wagons, barrels. | combat |
| `extraction` | Cashout depots and contested radius. | extraction loop |
| `pressure` | Final-rush lanes, unsafe zones, collapse routes. | battle royale |
| `proof` | Named sample points and shot anchors. | validation |

## Layer Rule

Each layer must carry source revision, coordinate space, resolution, normalization, allowed values, and consumer list.

## Failure Mode

If a future implementation creates a collider, prop scatter, route, or cashout marker without reading a layer or derived descriptor, the source-artboard contract has failed.

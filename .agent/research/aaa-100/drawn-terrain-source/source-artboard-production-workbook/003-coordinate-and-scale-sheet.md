# Coordinate And Scale Sheet

Status: active docs-only

## Purpose

Define the map scale before art or mesh code starts. A 60-player extraction battle royale needs space, route density, encounter control, and network partition assumptions.

## Required Fields

| Field | Required question |
| --- | --- |
| `worldBounds` | What is the playable rectangle or polygon? |
| `metersPerUnit` | What does one Three.js world unit mean? |
| `sourceResolution` | What is the height/mask resolution for the first fixture and final target? |
| `cellSize` | What is one LOD/network/proof cell? |
| `spawnBands` | Where can 1, 4, 20, and 60 players spawn without overlap? |
| `routeTravelTime` | How long should spawn -> mine -> cashout take at walking speed? |
| `sightlineBudget` | How far can players read town, mountain, mine, and cashout silhouettes? |
| `partitionHint` | What cells map to future 60-player interest partitions? |

## Initial Sizing Target

The first source fixture should be tiny but complete. The later production map should preserve the same fields while expanding bounds and cell count.

## Audit Risk

If scale is only a renderer multiplier, physics, routes, bot movement, camera framing, and 60-player staging will drift.

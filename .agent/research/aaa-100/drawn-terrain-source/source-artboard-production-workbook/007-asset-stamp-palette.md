# Asset Stamp Palette

Status: active docs-only

## Purpose

Define the terrain-grounded asset vocabulary needed before digital assets are imported, generated, or rendered at scale.

## Required Stamp Families

| Family | Placement source | Player purpose |
| --- | --- | --- |
| `ridge-rocks` | rock material, slope, blocker edge | silhouette and cover |
| `basin-scrub` | sand/clay biome, low slope | scale and motion parallax |
| `cactus-clusters` | dry basin and wash edges | identity and path framing |
| `mine-mouth` | mine shelf and blocker transition | objective landmark |
| `gold-seam` | gold mask and rock material | mining target |
| `tailings-pile` | mine/gold edge | resource readability |
| `rail-track` | rail layer | route and train continuity |
| `depot-cashout` | extraction mask | cashout landmark |
| `town-building` | town shelf, flat slope | orientation and cover |
| `wagon-barrel-cover` | cover mask, route edge | combat counterplay |
| `camp-props` | town/mine support zones | world believability |
| `dust-smoke-vfx` | route, train, cashout, pressure | feedback and atmosphere |

## Protokit Requirement

Every stamp family must map to a local GoldRush object protokit or candidate source packet before renderer batching.

## Placement Requirement

Asset placement must use artboard anchors or downward source raycast placement. Hidden renderer constants are a proof failure.

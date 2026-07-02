# Proof Shot List

Status: active docs-only

## Purpose

Define the human-view screenshots required before a drawn terrain source can be called better than the current plateau.

## Required Shots

| Shot | Camera state | Must prove |
| --- | --- | --- |
| `spawn-orientation` | over-the-shoulder at spawn | first route, terrain scale, landmark hierarchy |
| `train-arrival` | loading yard | track continuity and boarding destination |
| `basin-floor` | player walking | no flat test-grid feel |
| `central-mountain` | mid-distance | obstacle route value |
| `mine-approach` | action range | readable mine/gold target |
| `carry-route` | walking with cargo | cashout direction and danger |
| `town-shelf` | mid-distance | settlement identity and cover |
| `combat-lane` | threat route | cover, flank, sightline, retreat |
| `cashout-depot` | extraction range | landmark and interaction clarity |
| `horizon-blend` | far view | mesas and sky blend without debug seams |
| `lod-transition` | moving across a cell | no popping or collider mismatch |
| `public-proof` | deployed Build branch | public state matches local source revision |

## Failure Labels

- `overflat`
- `unreadableRoute`
- `wrongScale`
- `colliderMismatch`
- `assetScatterNoise`
- `debugMarkerDominance`
- `lodSeam`
- `publicDrift`

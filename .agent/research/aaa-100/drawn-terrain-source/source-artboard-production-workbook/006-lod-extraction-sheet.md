# LOD Extraction Sheet

Status: active docs-only

## Purpose

Define how the artboard turns into a massive terrain mesh without losing readability or performance.

## LOD Policy

| LOD | Source output | Must preserve |
| --- | --- | --- |
| `lod0-near` | dense terrain mesh plus collider samples | footing, seams, action surfaces |
| `lod1-mid` | simplified mesh plus prop clusters | routes, cover, mine/town/cashout landmarks |
| `lod2-far` | coarse mesh plus silhouette assets | mesas, central mountain, rail line, town/mine shapes |
| `lod3-horizon` | impostor or very coarse silhouette | sky blend and frontier scale |

## Chunk Contract

Each chunk must expose:

- source revision id
- bounds
- LOD level
- neighbor edges
- seam policy
- collider policy
- material mask coverage
- object anchor ids
- proof sample ids

## Audit Risk

If LOD is generated from camera distance only, it may pass a screenshot while breaking route readability, collision parity, or future 60-player partitioning.

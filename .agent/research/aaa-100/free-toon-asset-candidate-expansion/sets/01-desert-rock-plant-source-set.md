# 01 Desert Rock And Plant Source Set

Status: active docs-only

## Purpose

Give the massive desert terrain readable scale, cover, route texture, and biome identity without returning to primitive-only scatter.

## Candidate Sources

| Source | Candidate role | Current evidence |
| --- | --- | --- |
| Quaternius | rocks, cactus, nature props | main catalog lists nature, rocks, plants, cactus, and CC0-style free asset positioning |
| Kenney | simple toon rocks/plants and terrain-adjacent props | support page states asset pages are public domain CC0 |
| KayKit | stylized nature, block/resource props, toon-compatible forms | KayKit pages list CC0 character/asset packs and GLTF/FBX compatibility |

## Target Kit

`n:goldrush:desert-rock-plant-protokits`

## Data Exposed

- family id.
- candidate ids.
- biome tag.
- terrain mask tag.
- scale band.
- slope range.
- cover/readability role.
- collider role.
- draw distance tier.

## Placement Rule

All rocks and plants must be placed by terrain source masks and downward raycast proof. Renderer-only scatter is invalid.

## First Proof

Place one rock cluster and one cactus cluster on the first desert fixture:

```txt
source candidate
-> candidate manifest
-> rock/plant protokit descriptor
-> terrain raycast placement
-> local screenshot
-> public screenshot
```

## Rejection Rule

Reject candidates that collapse into dark boulders, float above terrain, clip below terrain, or lack a cover/readability role.


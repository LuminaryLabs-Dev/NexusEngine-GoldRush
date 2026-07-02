# 06 Combat Cover Weapon Cues Source Set

Status: active docs-only

## Purpose

Make ambush pressure legible by giving the player readable cover, threat lanes, and weapon silhouettes.

## Candidate Sources

| Source | Candidate role | Current evidence |
| --- | --- | --- |
| Quaternius Ultimate Guns / Toon Shooter / Survival tags | revolver/rifle-like silhouettes and cover-adjacent props | catalog lists revolver, pistol, rifle, shotgun, crates, barriers, and shooter tags |
| Quaternius rocks/nature | natural cover and route blockers | catalog lists rocks, cactus, trees, nature, and stylized packs |
| Kenney | impact/UI sound support for hit/cover/feedback | Impact Sounds page lists 130 CC0 audio files |

## Target Kit

`n:goldrush:combat-cover-protokits`

## Data Exposed

- cover object id.
- cover height.
- lane orientation.
- threat marker.
- weapon cue id.
- hit feedback cue.
- route risk tag.
- camera readability band.

## First Proof

```txt
cover candidate
-> lane descriptor
-> threat path
-> camera-readable marker
-> cover route proof
-> combat receipt proof
```

## Rejection Rule

Reject assets that add visual clutter without improving cover choice or threat readability.


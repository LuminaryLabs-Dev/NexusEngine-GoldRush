# 08 Sky Atmosphere Material Source Set

Status: active docs-only

## Purpose

Make the massive desert terrain blend into a coherent toon horizon without relying on a visible dome or flat debug color.

## Candidate Sources

| Source | Candidate role | Current evidence |
| --- | --- | --- |
| Poly Haven | CC0 HDRI/material reference candidates | source-candidate ledger already lists Poly Haven for CC0 HDRIs and textures |
| Kenney | stylized 2D/3D sky and UI color reference | Kenney support states asset pages are CC0 |
| Authored in-repo material work | final toon terrain/horizon palette | required because external HDRI realism may fight toon art direction |

## Target Kit

`n:goldrush:toon-atmosphere-protokits`

## Data Exposed

- sky palette id.
- horizon gradient id.
- terrain material band id.
- cloud layer id.
- fog band id.
- time-of-day role.
- screenshot proof state.

## First Proof

```txt
terrain palette swatch
-> horizon gradient
-> cloud layer
-> far mesa material
-> local/public screenshots
-> mobile screenshot
```

## Rejection Rule

Reject photo-real HDRI or texture candidates that overpower the toon terrain or make the player/POIs less readable.


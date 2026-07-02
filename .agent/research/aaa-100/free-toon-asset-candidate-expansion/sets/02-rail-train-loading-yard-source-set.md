# 02 Rail Train Loading Yard Source Set

Status: active docs-only

## Purpose

Make the first sequence feel intentional: train arrives, door opens, player boards, train departs, and the camera follows a believable western rail object.

## Candidate Sources

| Source | Candidate role | Current evidence |
| --- | --- | --- |
| Quaternius Modular Train Pack | train and track source | pack page states train assets in FBX, OBJ, Blend and free use in personal/commercial projects |
| Poly Pizza Modular Train Pack | GLTF/GLB delivery path for Quaternius train parts | bundle page lists GLTF download and CC0 per train/track item |
| KayKit Holiday Bits | toy train/track shapes as toon fallback vocabulary | listing mentions train and traintracks in a CC0 pack |

## Target Kit

`n:goldrush:rail-train-protokits`

## Data Exposed

- rail segment id.
- train body id.
- wagon id.
- door anchor.
- boarding anchor.
- path sample id.
- camera follow target.
- audio cue target.

## Placement Rule

Track pieces must be authored on the terrain source path. The train follows a path sample, not a sideways transform drift.

## First Proof

```txt
track source candidate
-> train source candidate
-> train protokit descriptor
-> path anchor fit
-> door anchor proof
-> boarding screenshot
-> departure motion proof
```

## Rejection Rule

Reject train candidates that cannot expose a door/boarding anchor, cannot be scaled to the character, or cannot follow the existing train path kit.


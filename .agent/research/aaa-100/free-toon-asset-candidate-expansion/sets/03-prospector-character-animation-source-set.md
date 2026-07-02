# 03 Prospector Character Animation Source Set

Status: active docs-only

## Purpose

Replace prototype character readability with a 3D toon prospector body that supports lobby spin, over-the-shoulder movement, mining, carrying, cover, and combat states.

## Candidate Sources

| Source | Candidate role | Current evidence |
| --- | --- | --- |
| Quaternius Ultimate Modular Men Pack | modular humanoid character base | page states 11 characters, 24 animations, FBX/OBJ/glTF/Blend, free personal/commercial use |
| Quaternius Universal Animation Library | locomotion and action motion reference | catalog lists humanoid retarget, locomotion, combat, idle, farming/fishing-style tags |
| KayKit Adventurers | toon character fallback and GLTF-friendly pipeline | page states FBX/GLTF files and CC0 use |

## Target Kit

`n:goldrush:prospector-character-protokits`

## Data Exposed

- rig candidate id.
- skeleton compatibility.
- animation clip ids.
- equipment attachment anchors.
- lobby preview pose.
- locomotion state.
- carry state.
- mining state.
- combat state.

## First Proof

```txt
character candidate
-> rig compatibility note
-> animation state map
-> lobby spin proof
-> over-the-shoulder walk proof
-> carry/mining pose proof
```

## Rejection Rule

Reject character candidates without knees, grounded foot readability, usable animation clips, or clear equipment anchors.


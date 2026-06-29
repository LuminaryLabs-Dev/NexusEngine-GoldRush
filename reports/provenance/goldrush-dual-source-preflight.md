# Gold Rush Provenance Preflight

Status: initial, unapproved.

This report does not approve any asset for runtime use.

## Source projects

```txt
GoldRush/      productName GoldRush, Unity 6000.0.37f1
GoldRush_Old/  productName Gold Rush, Unity 2022.3.5f1
```

## Default policy

```txt
Unknown origin -> do not promote.
Third-party plugin family -> do not copy.
Unity config/package files -> do not copy.
Game-owned visual candidate -> review before conversion.
Converted output -> review again before public/assets.
```

## Review required before sanitized conversion

Every candidate must record:

```txt
assetId
sourceProject
sourcePath
sourceCommitSha
sourceHash
reviewer
reviewDecision
approvedTargetUse
approvedTargetPath
```

## Blocked families

```txt
Photon/Fusion plugin and config files: blocked.
DOTween/Demigiant plugin files: blocked.
Unity package/config files: blocked.
Generated Unity folders: blocked.
```

## Candidate handling

```txt
FBX models: convert to GLB only after review.
Textures: convert to WebP/PNG/KTX2 only after review.
Unity prefabs: raw reference only, extract descriptors, never promote directly.
Unity scenes: raw reference only, extract layout JSON, never promote directly.
C# scripts: design reference only, never runtime copy.
```

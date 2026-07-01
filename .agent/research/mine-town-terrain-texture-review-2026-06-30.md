# Mine Town Terrain Texture Review

Date: 2026-06-30

## Domain

Content import, texture review, renderer material preparation.

## Sources

- Three.js texture docs: https://threejs.org/docs/#api/en/textures/Texture
- Three.js color management docs: https://threejs.org/docs/#manual/en/introduction/Color-management
- glTF 2.0 material and texture model: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#materials
- KTX 2.0 specification: https://github.khronos.org/KTX-Specification/

## Relevant Guidance

- Color/base-color textures should be treated differently from non-color data textures such as normal, roughness, metallic, AO, height, and specular maps.
- glTF-style runtime material promotion should preserve explicit texture intent instead of guessing all images as color maps.
- KTX2/Basis-style compression is the likely future browser-friendly review path for large repeated texture sets, but source review copies should stay lossless/source-backed until approval.

## GoldRush Interpretation

Batch `goldrush-dual-source-001.next.003.mine-town-terrain-props` is not one material. It contains terrain surfaces, town structures, train materials, mine-cart materials, plants, rocks, fences, UI images, and legacy character/mannequin texture references. The sanitized conversion therefore records:

```txt
role
textureIntent
dimensions
colorSpaceHint
compressionRecommendation
sourceHash
outputHash
promotionReady: false
```

## Current Result

```txt
outputs: 125
texture review copies: 125
bytes: 189,766,893
roles: 11
color textures: 57
data textures: 42
normal textures: 26
public promotion: false
runtime promotion: false
```

## AAA Gap

GoldRush still needs a material-authoring kit that takes approved texture records and builds actual Three.js materials per role:

```txt
n:render:material-library
└─ n:goldrush:frontier-materials
   ├─ terrain surface material sets
   ├─ train/rail material sets
   ├─ mine cart material sets
   ├─ town structure material sets
   ├─ desert plant/rock material sets
   ├─ UI-only rejection rules
   └─ KTX2/compression promotion plan
```

The next implementation should not make the renderer import `sanitized/` directly. It should create approval records and then consume `public/assets/...` through `assets/...` paths only.

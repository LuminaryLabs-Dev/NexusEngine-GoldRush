# Material And Terrain Source Review Pipeline

Date: 2026-06-30
Status: active
Scope: remaining batches `goldrush-dual-source-001.next.005` through `goldrush-dual-source-001.next.008`

## Intent

Finish copying the remaining material, terrain, and model source files from the legacy Gold Rush inventory while keeping the browser game protected from raw Unity formats.

## Source Notes

- Unity `.mat` and `.asset` files are source metadata, not browser runtime material files. They can identify shader properties, colors, texture GUID references, and terrain data references, but the browser runtime still needs an explicit Three.js/glTF material mapping.
- glTF 2.0 uses a PBR material model with metallic-roughness fields and texture references. GoldRush runtime material approval should map Unity material intent into explicit glTF/Three.js PBR metadata rather than assuming Unity shader data transfers directly.
- Three.js color management and texture color-space handling matter for review fidelity. Color textures and data textures need different color-space treatment before promotion.
- FBX remains an interchange/source format here. Approved runtime delivery should become reviewed GLB/glTF with scale, origin, collider, LOD, material, and license metadata.

Sources:

- https://docs.unity3d.com/Manual/Materials.html
- https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
- https://threejs.org/docs/#manual/en/introduction/Color-management
- https://threejs.org/docs/#examples/en/loaders/GLTFLoader

## Current Batch Facts

```txt
copied batches: 005, 006, 007, 008
copied items: 436
copied bytes: 114,955,461
sanitized outputs: 436
material metadata extracts: 367
terrain asset metadata extracts: 25
external FBX conversion requests: 44
runtime promotion: false
```

Role split:

```txt
train-material-or-model: 228
loot-material-or-model: 10
fence-material-or-model: 11
frontier-town-material-or-model: 52
desert-rock-material-or-model: 16
manual-review-source: 88
desert-flora-material-or-model: 3
frontier-utility-material-or-model: 3
terrain-source-asset: 25
```

## AAA Gaps

- Material role classification is only a first-pass source review. The `manual-review-source` bucket is too large for a final content pipeline.
- Unity shader fields are not enough for browser runtime. A reviewed PBR mapping needs base color, normal, roughness, metalness, emissive, alpha, tiling, and color-space policy.
- Terrain `.asset` files need a separate interpretation pass before they can inform heightfields, splat maps, nav limits, or terrain collider generation.
- Train material count is high because imported train/e2 source models carry many per-mesh material files. That needs deduplication and atlas/material-instance strategy before AAA rendering.
- Runtime performance needs LOD and instancing policy before thousands of props or material variants enter the scene.
- Approval still needs source-page/license provenance and human review before any file can enter `public/assets/`.

## Kit Gaps

- `n:content:unity-material-review`: parse material metadata into stable review records without runtime promotion.
- `n:render:pbr-material-map`: map approved review records into Three.js/glTF material descriptors.
- `n:world:unity-terrain-source-review`: classify Unity terrain assets into height, layer, splat, vegetation, collider, and reject-only candidates.
- `n:render:material-deduplication`: collapse repeated train/prop materials into shared runtime material families.
- `n:validation:approved-material-assets`: fail approved assets missing color-space, PBR, hash, license, and runtime path records.

## Validator Implications

- Keep `validate-remaining-mine-town-terrain-source-metadata-conversion.mjs` review-only.
- Add a future approved-material validator before promoting any material to `public/assets/`.
- Add browser proof after the first approved material family renders in the gold field.

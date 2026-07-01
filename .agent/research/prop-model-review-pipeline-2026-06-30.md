# Prop Model Review Pipeline

Date: 2026-06-30
Status: active
Scope: remaining batch `goldrush-dual-source-001.next.004.mine-town-terrain-props`

## Intent

Move copied mine, town, train, rock, and flora model candidates toward AAA runtime readiness without treating raw FBX or Unity prefabs as playable browser assets.

## Source Notes

- Khronos glTF 2.0 defines a JSON asset format for scenes, nodes, meshes, materials, animations, and binary buffers. GoldRush should treat glTF/GLB as the browser-runtime delivery target, not FBX.
- Three.js `GLTFLoader` is the runtime loading path for glTF/GLB assets and supports extension-based optimized delivery paths such as compressed geometry and texture workflows.
- Blender's glTF 2.0 importer/exporter is the practical offline conversion bridge for FBX/prefab-derived review work before approved assets are copied to `public/assets/`.

Sources:

- https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
- https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html

## Current Batch Facts

```txt
batch: goldrush-dual-source-001.next.004.mine-town-terrain-props
items: 125
bytes: 37,057,275
image review copies: 15
prefab metadata extracts: 79
external conversion requests: 31
runtime promotion: false
```

Role split:

```txt
mine-cart-prop: 6
manual-review-prop: 39
train-rail-prop: 12
legacy-character-reference: 7
desert-rock-prop: 23
frontier-town-prop: 17
desert-flora-prop: 21
```

## AAA Gaps

- Geometry scale is unknown until FBX candidates are converted and measured against the current GoldRush terrain units.
- Origins and pivots are unknown, which affects placement raycasts, prop instancing, train rail alignment, and building collision.
- Collider authoring is not solved; rocks, buildings, rails, carts, and flora need different collider policies.
- Material assignment is incomplete because Unity prefab/material metadata is not enough for browser PBR runtime use.
- LOD policy is missing for large terrain views with many small tessellation patches and many repeated props.
- Texture compression is not approved; runtime should eventually prefer compressed browser assets rather than raw review images.
- License provenance and human approval are still pending, so no asset can be exposed through `src/content/goldrushApprovedAssets.js`.
- Gameplay tags are missing: cover, obstruction, loot landmark, mine marker, town landmark, rail blocker, cosmetic-only, and traversal blocker.
- Network snapshot shape is missing for prop state that can change, such as mine carts, destructible props, loot, and train doors.
- Human-view proof is still required after any approved GLB is promoted.

## Kit Gaps

- `n:render:prop-glb-review`: convert approved external requests into GLB review manifests and renderer preview snapshots.
- `n:world:prop-placement-raycast`: place converted prop previews on visible terrain by terrain raycast, not hard-coded height.
- `n:physics:prop-collider-policy`: classify each prop into none, simple box, compound primitive, convex hull, or terrain blocker.
- `n:render:prop-lod-policy`: choose LOD/display ranges for towns, rocks, rails, plants, and mine props.
- `n:content:asset-approval-overlay`: map approved GLB and texture files into stable gameplay slots only after review gates pass.

## Validator Implications

- Add a future validator that fails any approved model asset without a GLB file, matching hash, scale metadata, origin metadata, collider policy, and safe `assets/...` runtime path.
- Add browser proof for at least one approved prop per role before claiming parity with legacy mine/town terrain assets.
- Keep the existing batch-004 conversion validator review-only until those future gates exist.

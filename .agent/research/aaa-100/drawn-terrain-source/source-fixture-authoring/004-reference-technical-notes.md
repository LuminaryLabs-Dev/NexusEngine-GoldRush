# Reference Technical Notes

Status: active docs-only
Domain: research / implementation guidance

## Sources Checked

| Source | Relevant point | GoldRush implication |
| --- | --- | --- |
| Three.js `LOD`, `https://threejs.org/docs/pages/LOD.html` | LOD selects objects by distance and can report the current active level. | GoldRush source chunks need explicit LOD level metadata and proof that the selected level matches distance. |
| Three.js `BufferGeometry`, `https://threejs.org/docs/` | Buffer geometry represents positions, face indices, normals, colors, UVs, and attributes in buffers. | Terrain chunks should be generated views of source samples with positions, indices, normals, colors, and source revision metadata. |
| Rapier JavaScript colliders, `https://rapier.rs/docs/user_guides/javascript/colliders/` | 3D heightfields are X-Z grids where each vertex has a Y height. | The source fixture height grid can map cleanly to a future Rapier heightfield if/when Rapier is added behind the physics API. |
| cannon-es `Heightfield`, `https://pmndrs.github.io/cannon-es/docs/classes/Heightfield.html` | Heightfield data is an array of evenly spaced height points. | The current cannon-es slice should keep source sample spacing explicit and deterministic. |

## Practical Implications

- Store sample spacing in the source fixture.
- Store source revision on every generated chunk and collider.
- Keep renderer geometry as a generated artifact, not the authority.
- Validate heightfield sample orientation before visual proof.
- Validate chunk edge samples before calling LOD stable.
- Keep a future Rapier path possible without replacing the source data contract.

## Open Research Gaps

- Determine the exact browser memory budget for near/mid/far terrain chunk sizes.
- Decide whether final far terrain should use simplified chunks, impostor strips, or baked horizon meshes.
- Decide whether source authoring begins as JSON grids, image-derived masks, glTF terrain, or a hybrid.


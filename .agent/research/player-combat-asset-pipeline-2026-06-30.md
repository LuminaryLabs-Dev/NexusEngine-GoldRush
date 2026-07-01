# Player Combat Asset Pipeline

Status: active

## Purpose

Document the next AAA gap after copying the source-backed player/combat batch: real runtime character fidelity requires browser-native GLB assets and animation binding, not raw FBX files.

## Source Notes

- Khronos positions glTF as a runtime 3D asset delivery format, which fits the browser runtime boundary better than Unity FBX source files.
- Three.js `GLTFLoader` is the natural browser loader for glTF/GLB assets, while `AnimationMixer` is the runtime player for animation clips bound to a scene object.
- The batch 002 FBX files should therefore become conversion requests, not direct runtime files.
- Mixamo-style animation clips may bind directly when skeletons match; retargeting is only needed when bone names/hierarchies differ. GoldRush should preserve retarget notes per clip instead of assuming compatibility.

## References

- https://www.khronos.org/gltf/
- https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
- https://threejs.org/docs/pages/GLTFLoader.html
- https://threejs.org/docs/pages/AnimationMixer.html

## Kit Gaps

- `n:content:model-conversion-request`: generic candidate kit for source model, desired runtime format, dependencies, and conversion status.
- `n:animation:clip-map`: generic candidate kit for mapping external clips to runtime states.
- `n:goldrush:prospector-runtime-character`: GoldRush kit that will load approved GLB, bind idle/run/aim/shoot/death clips, and expose the gameplay/lobby character snapshot.

## Validator Implications

- Raw FBX files must stay out of runtime and `public/assets/`.
- Sanitized conversion can write metadata and conversion-request JSON before approval.
- Runtime promotion must wait for GLB output hashes, clip map, license provenance, human review, approved runtime records, and browser proof with `AnimationMixer`.

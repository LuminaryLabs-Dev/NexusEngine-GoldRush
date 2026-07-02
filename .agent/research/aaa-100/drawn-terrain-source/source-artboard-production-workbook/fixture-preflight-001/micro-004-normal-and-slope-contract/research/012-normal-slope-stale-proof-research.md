# 012 - Normal Slope Stale Proof Research

Status: planned docs-only
Parent atom: `004-normal-and-slope-contract`

## Research Question

What external and local architecture signals constrain `normalSlopeRevisionPolicy` before implementation?

## Source Signals

- Unity TerrainData.GetInterpolatedNormal returns an interpolated normal at normalized terrain coordinates: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/TerrainData.GetInterpolatedNormal.html
- Unity TerrainData.GetSteepness gets terrain gradient at normalized terrain coordinates and returns a positive value: https://docs.unity3d.com/6000.1/Documentation/ScriptReference/TerrainData.GetSteepness.html
- Unity heightmaps define terrain point heights, so slope and normal proof must remain tied to the same height source: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
- Three.js BufferGeometry can store or compute normals for rendering, but GoldRush gameplay normals should be source-owned and only echoed by renderer geometry: https://threejs.org/docs/

## Domain Implication

- Terrain raycast owns query output for `normalSlopeRevisionPolicy`.
- Player grounding, placement, collider, renderer, and gameplay consumers must echo or derive from the same fixture revision.
- The field should be serializable in snapshots so local and public proof can compare terrain footing decisions.

## Data And Proof Implication

- Validator needs one good fixture case.
- Validator needs one negative case where old movement or placement caches survive after source terrain slope changes.
- Browser or state proof must show the field through the owning kit instead of renderer inspection.

## Edge Case

The most likely fake-completion path is accepting plausible normal or slope output while movement, placement, or collider code still uses its own local thresholds, gradients, or render geometry.

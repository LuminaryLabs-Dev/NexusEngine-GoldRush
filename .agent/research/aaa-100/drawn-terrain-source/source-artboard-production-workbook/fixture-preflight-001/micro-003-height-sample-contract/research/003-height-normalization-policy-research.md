# 003 - Height Normalization Policy Research

Status: planned docs-only
Parent atom: `003-height-sample-contract`

## Research Question

What external and local architecture signals constrain `heightNormalization` before implementation?

## Source Signals

- Unity heightmaps are rectangular arrays where stored values define terrain point or vertex height: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
- Unity terrain colliders build collision geometry from TerrainData shape, position, and scale, so height source parity is a physics requirement: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
- Unreal Landscape documentation ties valid height imports to explicit vertex and quad counts, so grid shape needs validation before terrain consumption: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
- Three.js Raycaster can return object intersections, but GoldRush height queries should be sourced from the authored fixture and only validated against render hits where useful: https://threejs.org/docs/

## Domain Implication

- World source owns `heightNormalization`.
- Render, collider, raycast, movement, placement, gameplay, and proof consumers must echo or derive from the same fixture revision.
- The field should be serializable in snapshots so local and public proof can compare source and consumer height values.

## Data And Proof Implication

- Validator needs one good fixture case.
- Validator needs one negative case where render mesh and physics collider interpret the same number as different vertical positions.
- Browser or state proof must show the field through the owning kit rather than through renderer inspection.

## Edge Case

The most likely fake-completion path is accepting a plausible height value while a downstream consumer still uses renderer geometry, procedural math, or cached collider data as the actual terrain source.

# 003 - Playable Bounds Rectangle Research

Status: planned docs-only
Parent atom: `002-bounds-scale-and-origin`

## Research Question

What external and local architecture signals constrain `worldBounds` before implementation?

## Source Signals

- Unreal Landscape documentation treats landscape components as render, visibility, and collision units, and valid landscape sizes depend on explicit vertex and quad counts: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
- Unity heightmap documentation defines terrain height as values in a rectangular array, and Unity terrain collider documentation says the collider matches the assigned terrain shape, position, and scale: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html and https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
- Three.js LOD documentation switches objects by distance, so source-owned terrain bounds and distance bands should feed terrain LOD selection: https://threejs.org/docs/pages/LOD.html
- The GitHub game engines collection is useful as a missing-feature scan, not a mandate to build a general engine: https://github.com/collections/game-engines

## Domain Implication

- World source owns `worldBounds`.
- Render, physics, placement, gameplay, LOD, and room-scale consumers must echo or derive from the same source revision.
- The field should be serializable in snapshots so local and public proof can compare the same value.

## Data And Proof Implication

- Validator needs one good fixture case.
- Validator needs one negative case where large terrain looks big but gameplay still happens in a tiny or undefined area.
- Browser or state proof must show the field through the owning kit rather than through renderer inspection.

## Edge Case

The most likely fake-completion path is accepting a plausible field value while a downstream consumer still uses its own local coordinate, distance, or scale assumption.

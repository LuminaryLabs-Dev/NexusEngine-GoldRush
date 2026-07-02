# 002 - Biome Mask Schema Research

Status: planned docs-only
Parent atom: `005-material-and-biome-mask-contract`

## Research Question

What external and local architecture signals constrain `biomeMask` before implementation?

## Source Signals

- Unity Terrain Layers are containers for terrain surface information, including textures and properties used by terrain materials: https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
- Unreal Landscape materials use layer blend nodes for multiple landscape layers, including alpha and height-based blending: https://dev.epicgames.com/documentation/unreal-engine/landscape-materials-in-unreal-engine
- Three.js MeshStandardMaterial is a render material using a PBR metallic-roughness workflow, so it should consume source surface data instead of owning terrain identity: https://threejs.org/docs/pages/MeshStandardMaterial.html
- The GitHub game engines collection is useful as a missing-feature scan for terrain/material subsystems, not a mandate to build a general engine: https://github.com/collections/game-engines

## Domain Implication

- Terrain material mask owns query output for `biomeMask`.
- Render, audio, VFX, placement, gameplay, and proof consumers must echo or derive from the same fixture revision.
- The field should be serializable in snapshots so local and public proof can compare terrain surface identity decisions.

## Data And Proof Implication

- Validator needs one good fixture case.
- Validator needs one negative case where asset scatter and gameplay zones invent biome identity outside the source fixture.
- Browser or state proof must show the field through the owning kit instead of renderer inspection.

## Edge Case

The most likely fake-completion path is accepting plausible material or biome labels while render batches, audio cues, VFX, placement filters, or gameplay zones still use local assumptions.

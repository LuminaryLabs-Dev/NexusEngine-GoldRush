# Material And Biome Mask Contract Research Matrix

Status: implemented-local
Parent atom: `005-material-and-biome-mask-contract`

## Purpose

Track the research note paired to each material and biome micro-step.

| ID | Research packet | Main risk being constrained |
| --- | --- | --- |
| 001 | [Material Mask Schema research](research/001-material-mask-schema-research.md) | renderer fills missing surface identity with a default color while gameplay and audio know nothing about it |
| 002 | [Biome Mask Schema research](research/002-biome-mask-schema-research.md) | asset scatter and gameplay zones invent biome identity outside the source fixture |
| 003 | [Material Tag Taxonomy research](research/003-material-tag-taxonomy-research.md) | render, audio, VFX, and placement use inconsistent names for the same ground surface |
| 004 | [Biome Tag Taxonomy research](research/004-biome-tag-taxonomy-research.md) | map regions look different but do not drive placement, route readability, or gameplay pressure consistently |
| 005 | [Mask Weight Domain research](research/005-mask-weight-domain-research.md) | layer blending hides invalid masks and consumers disagree about the dominant terrain surface |
| 006 | [Layer Priority And Blend Policy research](research/006-layer-priority-and-blend-policy-research.md) | Unity-like terrain painting and Unreal-like layer blending semantics are mixed without a source rule |
| 007 | [Render Material Consumer Parity research](research/007-render-material-consumer-parity-research.md) | Three.js materials become the terrain identity source instead of rendering source-owned masks |
| 008 | [Audio Vfx Surface Consumer Parity research](research/008-audio-vfx-surface-consumer-parity-research.md) | footstep, mining, dust, hit, and ambience cues stay generic even when the terrain visually changes |
| 009 | [Placement Biome Filter Parity research](research/009-placement-biome-filter-parity-research.md) | rocks, plants, rails, camps, and gold props scatter from renderer geometry rather than authored surface intent |
| 010 | [Gameplay Zone Material Parity research](research/010-gameplay-zone-material-parity-research.md) | receipts prove actions that were detached from the authored terrain surface and biome context |
| 011 | [Mask Negative Fixture Cases research](research/011-mask-negative-fixture-cases-research.md) | validation only checks that a mask exists and misses broken material or biome contracts |
| 012 | [Material Biome Stale Proof research](research/012-material-biome-stale-proof-research.md) | old renderer batches, object placements, or proof screenshots survive after surface identity changes |

## Source Set

- Unity Terrain Layers: https://docs.unity3d.com/6000.4/Documentation/Manual/class-TerrainLayer.html
- Unreal Landscape Materials: https://dev.epicgames.com/documentation/unreal-engine/landscape-materials-in-unreal-engine
- Three.js MeshStandardMaterial: https://threejs.org/docs/pages/MeshStandardMaterial.html
- GitHub game engines collection: https://github.com/collections/game-engines

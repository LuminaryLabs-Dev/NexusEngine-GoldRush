# Normal And Slope Contract Research Matrix

Status: implemented-local
Parent atom: `004-normal-and-slope-contract`

## Purpose

Track the research note paired to each normal and slope micro-step.

| ID | Research packet | Main risk being constrained |
| --- | --- | --- |
| 001 | [Normal Vector Shape research](research/001-normal-vector-shape-research.md) | movement and placement accept malformed normals that only work in renderer lighting | implemented-local |
| 002 | [Normal Space Contract research](research/002-normal-space-contract-research.md) | character grounding, prop alignment, and lighting use normals from different coordinate spaces | implemented-local |
| 003 | [Slope Value Domain research](research/003-slope-value-domain-research.md) | steep terrain is treated as walkable because slope values are silently clamped or ignored | implemented-local |
| 004 | [Slope Class Taxonomy research](research/004-slope-class-taxonomy-research.md) | gameplay logic invents walkability labels outside the terrain source contract | implemented-local |
| 005 | [Walkable Slope Thresholds research](research/005-walkable-slope-thresholds-research.md) | the player can climb mountains or gets blocked on gentle terrain because thresholds are duplicated | implemented-local |
| 006 | [Normal Derivation Source research](research/006-normal-derivation-source-research.md) | renderer-generated normals become gameplay truth without source validation | implemented-local |
| 007 | [Gradient Sample Neighborhood research](research/007-gradient-sample-neighborhood-research.md) | slope flips or pulses across cells because each consumer samples a different neighborhood | implemented-local |
| 008 | [Sample Ground Api Shape research](research/008-sample-ground-api-shape-research.md) | height, normal, and slope are queried separately and drift between systems | implemented-local |
| 009 | [Movement Consumer Parity research](research/009-movement-consumer-parity-research.md) | camera and character feel stable in proof while movement still uses hidden slope logic | implemented-local |
| 010 | [Placement Consumer Parity research](research/010-placement-consumer-parity-research.md) | rocks, plants, mines, and cashout props look grounded but are aligned by renderer fallback | implemented-local |
| 011 | [Slope Negative Fixture Cases research](research/011-slope-negative-fixture-cases-research.md) | validation only checks that slope exists and misses broken terrain-footing data | implemented-local |
| 012 | [Normal Slope Stale Proof research](research/012-normal-slope-stale-proof-research.md) | old movement or placement caches survive after source terrain slope changes | implemented-local |

## Source Set

- Unity GetInterpolatedNormal: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/TerrainData.GetInterpolatedNormal.html
- Unity GetSteepness: https://docs.unity3d.com/6000.1/Documentation/ScriptReference/TerrainData.GetSteepness.html
- Unity heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
- Three.js docs: https://threejs.org/docs/

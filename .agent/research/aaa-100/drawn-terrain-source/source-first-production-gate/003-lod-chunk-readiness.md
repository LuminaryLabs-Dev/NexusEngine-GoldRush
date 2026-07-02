# LOD Chunk Readiness

Status: active docs-only
Domain: world / render / performance

## Purpose

Define when GoldRush can claim that the drawn terrain source is ready for LOD work.

## LOD Readiness Requirements

| Requirement | Why it matters | Proof |
| --- | --- | --- |
| Source-defined chunk grid | Prevents renderer-only chunking from drifting. | Chunk metadata validator. |
| Neighbor seam rules | Prevents cracks and blue-gap regressions. | Seam sample validator. |
| Near/mid/far rings | Keeps player footing detailed while horizon is cheap. | Screenshot and camera-route proof. |
| Hysteresis or transition band | Prevents popping and flicker at boundaries. | Motion proof or sampled frame proof. |
| Collider source parity | Prevents visible terrain and collision from disagreeing. | Max mismatch metric. |
| Public proof label | Prevents local-only terrain from being called deployed. | Public report with revision id. |

## Chunk Contract Seed

```txt
chunk
|-- chunkId
|-- revisionId
|-- bounds
|-- lodLevel
|-- edgePolicy
|-- neighborIds
|-- maskCoverage
|-- colliderCoverage
`-- proofSamples
```

## LOD Failure Modes

- near band looks correct, far band uses a different height source
- LOD edges pop during normal walking
- object anchors remain on old terrain after LOD change
- colliders are high resolution but visible mesh is not
- screenshots pass from one angle while side angles show seams

## Gate

Do not call the LOD system ready until a player can walk through a near-to-mid transition while screenshots or sampled frames prove no cracks, major popping, or collider mismatch.


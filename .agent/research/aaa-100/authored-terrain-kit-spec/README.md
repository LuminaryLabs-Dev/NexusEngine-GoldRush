# Authored Terrain Kit Spec

Status: active docs-only

## Purpose

Define the implementation-ready contract for replacing the current plateau-prone procedural terrain pass with a drawn/authored desert map source that every terrain, collider, placement, route, gold, town, extraction, and combat system can consume.

## Why This Exists

The project is plateauing because the scene can become denser without becoming more coherent. The map must become the primary digital asset and source of truth, then procedural protokits should attach to that source through masks, anchors, route corridors, and raycasts.

## Kit Stack

~~~txt
n:world:authored-terrain-mesh
|-- neutral incubator source-data kit
|-- no GoldRush rules
|-- height, normals, masks, chunks, raycast samples
|
`-- n:goldrush:desert-world-map
    |-- GoldRush custom orchestration
    |-- towns, mines, rails, gold seams, extraction sites, cover lanes
    `-- feeds render, physics, control, gameplay, network, staging, proof
~~~

## Files

- source-reference-index.md
- 001-kit-contract-generic-authored-terrain-mesh.md
- 002-kit-contract-goldrush-desert-world-map.md
- 003-terrain-source-data-schema.md
- 004-lod-rendering-contract.md
- 005-collider-parity-contract.md
- 006-placement-and-raycast-contract.md
- 007-gameplay-zone-contract.md
- 008-consumer-web-and-event-flow.md
- 009-readiness-gate-matrix.md
- 010-failure-mode-matrix.md
- 011-implementation-sequence.md
- 012-proof-and-deploy-plan.md
- implementation-batch-001/

## Implementation Batch 001

- [Implementation batch 001](implementation-batch-001/README.md)
- Converts the plateau diagnosis into source-fixture, terrain, LOD, collider, placement, consumer, validation, proof, deploy, sanitization, restart, and stop-condition packets.
- This is still docs-only. Runtime work should start from these packets only after implementation is explicitly allowed.

## Rule

Do not implement this as a broad renderer rewrite. Implement the source contract first, then let render, physics, gameplay, and prop protokits consume the same source data.

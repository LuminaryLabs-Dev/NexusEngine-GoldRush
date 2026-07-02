# Authored Terrain Implementation Batch 001

Status: active docs-only

## Purpose

Convert the current plateau diagnosis into implementation-ready packets for an authored desert terrain source. This batch does not implement runtime code. It defines the first source-data, consumer, validation, and proof contracts that should exist before terrain code changes.

## Plateau Diagnosis

GoldRush is plateauing because the project has more kit scaffolding than authored world truth. The terrain is currently asked to be visual asset, collider, navigation field, gameplay mask, prop placement field, combat space, and proof artifact at the same time, but those roles do not yet share one drawn source.

The fix is not just more procedural props. The fix is a map-source asset pipeline:

- draw or author the desert terrain source first
- store height, masks, chunks, anchors, and zones as source data
- let render, physics, control, gameplay, prop protokits, and proof consume snapshots from that source
- validate every consumer against the same terrain revision
- only then add higher-fidelity meshes, toon assets, towns, rocks, rails, mines, gold zones, and combat cover

## Batch Tree

~~~txt
implementation-batch-001
|-- source fixture contracts
|-- height, mask, chunk, raycast, and anchor contracts
|-- LOD and collider parity contracts
|-- render, physics, control, gameplay, and prop consumer contracts
`-- validation, human-view, public deploy, sanitization, restart, and stop-condition contracts
~~~

## Operating Rule

When implementation resumes, start with the neutral source-data kit `n:world:authored-terrain-mesh`, then connect the GoldRush orchestration kit `n:goldrush:desert-world-map`. Do not start with a renderer patch, a bigger random terrain plane, or a broad asset scatter pass.

## References

- Parent spec: `../README.md`
- Source reference index: `../source-reference-index.md`
- Authored map cluster: `../../authored-map-cluster.md`
- Atomic matrix: `../../authored-map-atomic-matrix.md`
- Continuous audit index: `../../continuous-audit-index.md`

## Files

- `batch-matrix.md`
- 001-source-fixture-file-layout.md
- 002-source-revision-hash-policy.md
- 003-world-bounds-and-scale-fixture.md
- 004-height-grid-fixture.md
- 005-normal-slope-derivation.md
- 006-mask-stack-fixture.md
- 007-chunk-index-fixture.md
- 008-raycast-down-fixture.md
- 009-placement-anchor-fixture.md
- 010-lod-band-fixture.md
- 011-collider-parity-fixture.md
- 012-desert-map-zone-fixture.md
- 013-render-consumer-contract.md
- 014-physics-consumer-contract.md
- 015-control-consumer-contract.md
- 016-gameplay-consumer-contract.md
- 017-prop-protokit-consumer-contract.md
- 018-validation-cli-contract.md
- 019-human-view-proof-contract.md
- 020-public-deploy-proof-contract.md
- 021-sanitized-report-contract.md
- 022-restart-rollback-contract.md
- 023-open-questions.md
- 024-implementation-stop-conditions.md

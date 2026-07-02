# Authored Map Cluster

Status: active

## Purpose

Coordinate the first implementation-ready research cluster for the drawn terrain kit. This cluster is the bridge from the current procedural field to a map-source pipeline that can support a 60-player wild-west extraction battle royale.

## Active Packets

- 021: [Terrain intention map](021-terrain-intention-map.md) -> [child packets](021-terrain-intention-map/README.md)
- 022: [Top-down terrain plate](022-top-down-terrain-plate.md) -> [child packets](022-top-down-terrain-plate/README.md)
- 023: [Height/mask data model](023-height-mask-data-model.md) -> [child packets](023-height-mask-data-model/README.md)
- 024: [LOD ring contract](024-lod-ring-contract.md) -> [child packets](024-lod-ring-contract/README.md)
- 026: [Collider parity](026-collider-parity.md) -> [child packets](026-collider-parity/README.md)
- 040: [Prop protokit library](040-prop-protokit-library.md) -> [child packets](040-prop-protokit-library/README.md)

## Atomic Packet Layer

- [Authored map atomic matrix](authored-map-atomic-matrix.md)
- 90 implementation-sized packets across terrain intention, source plate, masks, LOD, collider parity, and prop protokits.
- Use these packets before runtime implementation so `n:goldrush:authored-desert-map` is built from named contracts instead of another broad procedural pass.

## Atomic Research Layer

- [Authored map atomic research matrix](authored-map-atomic-research-matrix.md)
- 360 research packets: source research, domain implication, data/proof, and edge-case audit for each atomic packet.
- Use the research packet set to keep game-engine references, BR/extraction references, terrain-source data, proof requirements, and deploy risks separated instead of hiding them in one broad plan.

## Kit Spec Layer

- [Authored terrain kit spec](authored-terrain-kit-spec/README.md)
- Defines `n:world:authored-terrain-mesh` as the neutral source-data kit.
- Defines `n:goldrush:desert-world-map` as the GoldRush custom map orchestration kit.
- Defines source data, LOD, collider parity, raycast placement, gameplay zones, consumer flow, readiness gates, failure modes, and proof/deploy gates.

## Implementation Batch Layer

- [Authored terrain implementation batch 001](authored-terrain-kit-spec/implementation-batch-001/README.md)
- Breaks the first code-phase candidate into 24 source-data, consumer, proof, and stop-condition packets.
- Use this batch to avoid another broad procedural terrain rewrite when implementation resumes.

## Intended Kit Stack

```txt
n:goldrush:authored-desert-map
|-- terrain intention map
|-- top-down terrain plate
|-- height and gameplay masks
|-- LOD ring contract
|-- collider parity proof
`-- prop protokit library consumers
```

The implementation-facing owner name is now clarified as `n:goldrush:desert-world-map`, backed by the neutral `n:world:authored-terrain-mesh` source kit. Older references to `n:goldrush:authored-desert-map` are treated as the same active concept until implementation names are finalized.

## Hard Gate

Runtime implementation should start only after these packets agree on scale, source layers, public data, placement rules, collider parity, player-view proof, and deploy risk.

After that agreement, implementation should still proceed one atomic packet at a time with a validator or human-view proof attached to each visible/player-facing change. If an atom's four research packets disagree, update docs first and do not code through the uncertainty.

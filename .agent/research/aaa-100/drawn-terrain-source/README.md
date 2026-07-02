# Drawn Terrain Source Packet

Status: active docs-only
Date: 2026-07-01
Domain: world / render / physics / content

## Purpose

Capture the current plateau diagnosis and define the next non-code production direction: GoldRush needs a drawn, authored, massive desert terrain source that becomes the primary world asset and feeds LOD, collision, placement, routes, gold zones, towns, combat lanes, extraction sites, and proof.

## Core Diagnosis

The game is plateauing because the scene can become denser without becoming more authored. More procedural props, rings, terrain patches, or validation receipts will not create AAA map quality by themselves.

Current terrain progress proves that grounding, raycast placement, and continuous rendering are possible. It does not yet prove that the map has:

- authored scale
- strong silhouettes
- readable routes
- meaningful landmarks
- biome/material zones
- player-facing traversal rhythm
- intentional combat and extraction spaces
- digital asset families grounded in the map

## Direction

```txt
drawn desert terrain source
|-- top-down source plate
|-- height and slope data
|-- normal data
|-- material and biome masks
|-- route, rail, wash, town, mine, gold, cover, extraction masks
|-- chunk and LOD metadata
|-- placement anchors for object protokits
|-- collider parity fixtures
`-- proof fixtures for local/public human-view tests
```

The drawn terrain source should become the authority. Renderer meshes, physics colliders, object protokits, player route guidance, and combat/extraction kits should consume this source instead of inventing local terrain decisions.

## Files

- `001-plateau-diagnosis.md`
- `002-drawn-terrain-source-contract.md`
- `003-lod-mesh-plan.md`
- `004-digital-asset-family-plan.md`
- `005-consumer-domain-matrix.md`
- `006-reference-research-notes.md`
- `007-atomic-next-steps.md`
- `atomic-matrix.md`
- `research-matrix.md`
- `atomic/`
- `research/`
- `source-fixture-authoring/`

## Atomic Layer

The atomic layer expands this source-asset decision into:

- 12 source families
- 48 implementation-sized atomic packets
- 48 paired research notes

The atoms cover source governance, coordinate scale, heightfield form, material masks, walkable/blocker masks, LOD topology, collider parity, placement anchors, route/rail/wash networks, gameplay zones, asset family anchors, and proof/deploy/restart gates.

## Source Fixture Authoring

`source-fixture-authoring/` defines the first tiny authored terrain source fixture, its required schema, layer matrix, validation plan, consumer proof matrix, restart policy, and first map-slice simulation.

## Relationship To Existing Packets

This packet sits on top of the existing authored-map and authored-terrain packets:

- `.agent/research/aaa-100/021-terrain-intention-map.md`
- `.agent/research/aaa-100/022-top-down-terrain-plate.md`
- `.agent/research/aaa-100/024-lod-ring-contract.md`
- `.agent/research/aaa-100/025-terrain-mesh-chunking.md`
- `.agent/research/aaa-100/authored-terrain-kit-spec/README.md`

It does not replace those packets. It clarifies why the next terrain pass should start with source asset authoring before implementation.

## Non-Code Rule

Do not implement this packet until the user explicitly resumes code work. The next implementation should start with a small source fixture and validators, not a broad renderer rewrite.

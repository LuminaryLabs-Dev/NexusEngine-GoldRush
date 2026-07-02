# Source Revision Contract

Status: active docs-only
Domain: world / runtime / validation

## Purpose

Define the minimal source revision contract that prevents future map work from splitting into incompatible renderer, physics, placement, and gameplay sources.

## Contract

```txt
terrainSourceRevision
|-- sourceId
|-- revisionId
|-- worldBounds
|-- metersPerUnit
|-- heightResolution
|-- maskResolution
|-- chunkSize
|-- lodRings
|-- requiredMasks
|-- proofFixtures
`-- consumers
```

## Required Masks

| Mask | Consumer | Reason |
| --- | --- | --- |
| walkable | movement, route guidance, bot staging | Keeps player and AI traversal honest. |
| blocker | physics, camera, combat routing | Stops mountains and cliffs from becoming visual-only. |
| material | renderer, toon shader, asset families | Keeps color bands and prop biomes source-owned. |
| rail | train, loading yard, extraction depot | Keeps train and depot placement coherent. |
| wash | movement, route guidance, gold seams | Gives desert valleys and lowlands gameplay purpose. |
| town | town protokits, cover, staging | Keeps settlements intentional. |
| mine | mine entrances, gold resources | Keeps mining spaces authored. |
| gold | economy, route guidance, bot goals | Keeps resources tied to terrain logic. |
| cover | combat, bots, camera readability | Keeps fights readable. |
| extraction | cashout, results, risk tuning | Keeps extraction sites source-derived. |

## Event Seed

| Event | Payload |
| --- | --- |
| `terrainSource.loaded` | sourceId, revisionId, worldBounds, mask list |
| `terrainSource.consumerBound` | consumer id, revisionId, required masks |
| `terrainSource.proofSampled` | sample set, max mismatch, proof kind |
| `terrainSource.rejected` | reason, missing field, consumer |

## Snapshot Seed

The snapshot must expose only shareable source metadata:

- source id
- revision id
- bounds
- active LOD rings
- loaded chunk count
- required mask names
- consumer ids
- proof status

It must not expose local machine paths, source-only staging locations, or unapproved asset paths.


# Query Contract

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Define the minimum public API shape for future terrain-source consumers.

## Public Queries

| Query | Input | Output |
| --- | --- | --- |
| `getFixtureSummary()` | none | fixture id, revision id, bounds, layer list, consumer list. |
| `sampleHeight(x, z)` | world x/z | height, revision id, source cell id. |
| `sampleGround(x, z)` | world x/z | height, normal, slope class, walkable, material. |
| `raycastDown(x, y, z)` | world ray origin | hit, point, normal, slope class, material, revision id. |
| `getZoneAt(x, z)` | world x/z | route, mine, gold, cover, cashout, pressure tags. |
| `getAnchors(filter)` | anchor family or region | anchor ids, transforms, masks, constraints. |
| `getLodCell(position, range)` | camera/player position | near, mid, far, or horizon cell descriptor. |

## Events

| Event | Meaning |
| --- | --- |
| `terrainFixtureLoaded` | Fixture parsed and validated. |
| `terrainFixtureRejected` | Fixture failed schema or parity checks. |
| `terrainRevisionChanged` | Restart is required because source revision changed. |
| `terrainConsumerReady` | One consumer reports fixture id and revision id. |
| `terrainConsumerDrift` | One consumer reports a mismatched revision or local fallback. |

## Snapshot

The snapshot must include:

- fixture id
- revision id
- bounds
- layer count
- LOD cell count
- anchor count by family
- annotation count by family
- ready consumers
- drift consumers
- last validation result

## Reset

`reset(revisionId)` must drop all derived render, physics, placement, gameplay, and proof caches tied to the previous revision.

## Stop Condition

Stop if any future consumer can use terrain source data without also exposing the fixture id and revision id in its snapshot.

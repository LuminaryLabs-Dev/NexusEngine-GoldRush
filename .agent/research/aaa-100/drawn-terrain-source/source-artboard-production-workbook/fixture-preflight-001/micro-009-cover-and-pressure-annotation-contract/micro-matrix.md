# Cover And Pressure Annotation Contract Micro Matrix

Status: active docs-only
Parent atom: `009-cover-and-pressure-annotation-contract`

## Purpose

Track the 12 micro-steps required before future code can safely claim the terrain fixture has usable cover and pressure annotations.

| ID | Micro atom | Source field | Required proof | State |
| --- | --- | --- | --- | --- |
| 001 | [Cover Pocket Schema](micro/001-cover-pocket-schema.md) | coverPockets | validator proves source-owned cover pockets have id, shape, stance class, protection direction, exposure class, and revision | planned |
| 002 | [Threat Lane Schema](micro/002-threat-lane-schema.md) | threatLanes | validator proves threat lanes have id, origin band, target band, width, visibility class, risk tier, and revision | planned |
| 003 | [Pressure Seed Schema](micro/003-pressure-seed-schema.md) | pressureSeeds | validator proves pressure seeds have id, trigger tags, intensity range, radius, route relation, and revision | planned |
| 004 | [Sightline And Occlusion Tags](micro/004-sightline-and-occlusion-tags.md) | sightlineOcclusionTags | validator proves cover and threat lanes expose line-of-sight, occlusion, elevation, peek, and flank tags as closed source-owned values | planned |
| 005 | [Pressure Route Linkage](micro/005-pressure-route-linkage.md) | pressureRouteLinks | validator proves every pressure seed links to route ids, segment ids, approach lanes, retreat lanes, and fixture revision | planned |
| 006 | [Cover Counterplay Contract](micro/006-cover-counterplay-contract.md) | coverCounterplay | validator proves each threat lane has at least one reachable counterplay pocket, flank, retreat, or low-exposure route | planned |
| 007 | [Combat Proof Point Contract](micro/007-combat-proof-point-contract.md) | combatProofPoints | fixture names proof points for safe approach, exposed crossing, cover entry, peek, flank, ambush trigger, retreat, and off-route failure | planned |
| 008 | [Pressure Query API Shape](micro/008-pressure-query-api-shape.md) | pressureQueryApi | getPressureAt reports cover id, threat lane id, seed id, risk tier, counterplay id, and revision at named proof points | planned |
| 009 | [Renderer Threat Readability Parity](micro/009-renderer-threat-readability-parity.md) | rendererThreatEcho | renderer snapshots echo source cover id, threat lane id, telegraph role, visibility band, and fixture revision | planned |
| 010 | [Combat Loop Consumer Parity](micro/010-combat-loop-consumer-parity.md) | combatLoopPressureEcho | ambush pressure, combat route guidance, action surface, receipts, replay, and results name the same source pressure ids | planned |
| 011 | [Cover Pressure Negative Fixture Cases](micro/011-cover-pressure-negative-fixture-cases.md) | coverPressureNegativeCases | validator fails missing cover ids, duplicate lane ids, orphan pressure seeds, unknown tags, unreachable counterplay, and stale consumer echoes | planned |
| 012 | [Cover Pressure Stale Proof](micro/012-cover-pressure-stale-proof.md) | coverPressureRevisionPolicy | source revision changes mark renderer telegraphs, combat routing, ambush receipts, screenshots, simulator proof, and public proof stale | planned |

## Use Rule

Future implementation should start at 001 and stop whenever a validator can pass without proving source-owned cover identity, pressure identity, counterplay, consumer echo, negative fixture cases, and stale-proof behavior.

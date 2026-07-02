# Cover And Pressure Annotation Contract Audit Matrix

Status: active docs-only
Parent atom: `009-cover-and-pressure-annotation-contract`

## Purpose

Attach a hardening audit to every cover/pressure micro-step so future code cannot claim combat readability from unowned lanes, spawned pressure, or helper-only combat state.

| ID | Audit packet | Source field | Hardening focus | State |
| --- | --- | --- | --- | --- |
| 001 | [Cover Pocket Schema Audit](audits/001-cover-pocket-schema-audit.md) | coverPockets | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 002 | [Threat Lane Schema Audit](audits/002-threat-lane-schema-audit.md) | threatLanes | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 003 | [Pressure Seed Schema Audit](audits/003-pressure-seed-schema-audit.md) | pressureSeeds | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 004 | [Sightline And Occlusion Tags Audit](audits/004-sightline-and-occlusion-tags-audit.md) | sightlineOcclusionTags | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 005 | [Pressure Route Linkage Audit](audits/005-pressure-route-linkage-audit.md) | pressureRouteLinks | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 006 | [Cover Counterplay Contract Audit](audits/006-cover-counterplay-contract-audit.md) | coverCounterplay | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 007 | [Combat Proof Point Contract Audit](audits/007-combat-proof-point-contract-audit.md) | combatProofPoints | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 008 | [Pressure Query API Shape Audit](audits/008-pressure-query-api-shape-audit.md) | pressureQueryApi | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 009 | [Renderer Threat Readability Parity Audit](audits/009-renderer-threat-readability-parity-audit.md) | rendererThreatEcho | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 010 | [Combat Loop Consumer Parity Audit](audits/010-combat-loop-consumer-parity-audit.md) | combatLoopPressureEcho | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 011 | [Cover Pressure Negative Fixture Cases Audit](audits/011-cover-pressure-negative-fixture-cases-audit.md) | coverPressureNegativeCases | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 012 | [Cover Pressure Stale Proof Audit](audits/012-cover-pressure-stale-proof-audit.md) | coverPressureRevisionPolicy | source ownership, counterplay, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |

## Audit Rule

The audit fails if threat lanes, cover guidance, ambush pressure, combat receipts, replay, or public proof can succeed without naming the same source cover/pressure ids and fixture revision.

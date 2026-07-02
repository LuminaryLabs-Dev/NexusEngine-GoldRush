# Cover And Pressure Annotation Contract Simulation Matrix

Status: active docs-only
Parent atom: `009-cover-and-pressure-annotation-contract`

## Purpose

Run a docs-only implementation rehearsal for every cover/pressure micro-step before code is allowed.

| ID | Simulation packet | Source field | Simulated implementation question | State |
| --- | --- | --- | --- | --- |
| 001 | [Cover Pocket Schema Simulation](simulations/001-cover-pocket-schema-simulation.md) | coverPockets | what breaks if coverPockets is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 002 | [Threat Lane Schema Simulation](simulations/002-threat-lane-schema-simulation.md) | threatLanes | what breaks if threatLanes is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 003 | [Pressure Seed Schema Simulation](simulations/003-pressure-seed-schema-simulation.md) | pressureSeeds | what breaks if pressureSeeds is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 004 | [Sightline And Occlusion Tags Simulation](simulations/004-sightline-and-occlusion-tags-simulation.md) | sightlineOcclusionTags | what breaks if sightlineOcclusionTags is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 005 | [Pressure Route Linkage Simulation](simulations/005-pressure-route-linkage-simulation.md) | pressureRouteLinks | what breaks if pressureRouteLinks is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 006 | [Cover Counterplay Contract Simulation](simulations/006-cover-counterplay-contract-simulation.md) | coverCounterplay | what breaks if coverCounterplay is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 007 | [Combat Proof Point Contract Simulation](simulations/007-combat-proof-point-contract-simulation.md) | combatProofPoints | what breaks if combatProofPoints is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 008 | [Pressure Query API Shape Simulation](simulations/008-pressure-query-api-shape-simulation.md) | pressureQueryApi | what breaks if pressureQueryApi is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 009 | [Renderer Threat Readability Parity Simulation](simulations/009-renderer-threat-readability-parity-simulation.md) | rendererThreatEcho | what breaks if rendererThreatEcho is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 010 | [Combat Loop Consumer Parity Simulation](simulations/010-combat-loop-consumer-parity-simulation.md) | combatLoopPressureEcho | what breaks if combatLoopPressureEcho is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 011 | [Cover Pressure Negative Fixture Cases Simulation](simulations/011-cover-pressure-negative-fixture-cases-simulation.md) | coverPressureNegativeCases | what breaks if coverPressureNegativeCases is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |
| 012 | [Cover Pressure Stale Proof Simulation](simulations/012-cover-pressure-stale-proof-simulation.md) | coverPressureRevisionPolicy | what breaks if coverPressureRevisionPolicy is introduced into source, renderer, combat routing, receipts, replay, and proof consumers | planned |

## Use Rule

Future implementation should read the simulation before code and treat any fakeout, direct setup helper, renderer-only lane, stale revision, or narrow proof as a stop condition.

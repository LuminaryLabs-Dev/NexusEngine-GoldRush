# Route Annotation Contract Simulation Matrix

Status: active docs-only
Parent atom: `007-route-annotation-contract`

## Purpose

Track one implementation simulation per route annotation micro-step.

| ID | Simulation | First expected failure | Recovery idea | State |
| --- | --- | --- | --- | --- |
| 001 | [Primary Route Schema Simulation](simulations/001-primary-route-schema-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without primaryRoute | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 002 | [Alternate Route Schema Simulation](simulations/002-alternate-route-schema-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without alternateRoutes | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 003 | [Branch And Return Lane Schema Simulation](simulations/003-branch-and-return-lane-schema-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without branchReturnLanes | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 004 | [Route Node And Segment Id Simulation](simulations/004-route-node-and-segment-id-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without routeNodesAndSegments | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 005 | [Route Width And Corridor Budget Simulation](simulations/005-route-width-and-corridor-budget-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without routeCorridorBudget | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 006 | [Route Cost Risk And Speed Tags Simulation](simulations/006-route-cost-risk-and-speed-tags-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without routeCostRiskTags | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 007 | [Get Zone At Route Query Simulation](simulations/007-get-zone-at-route-query-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without getZoneAtRouteQuery | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 008 | [Route Proof Points Simulation](simulations/008-route-proof-points-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without routeProofPoints | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 009 | [Player Guidance Consumer Parity Simulation](simulations/009-player-guidance-consumer-parity-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without playerRouteGuidanceEcho | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 010 | [AI Staging Route Parity Simulation](simulations/010-ai-staging-route-parity-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without aiRouteStagingEcho | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 011 | [Route Negative Fixture Cases Simulation](simulations/011-route-negative-fixture-cases-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without routeNegativeCases | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |
| 012 | [Route Stale Proof Simulation](simulations/012-route-stale-proof-simulation.md) | route behavior is inferred from visible trail, coordinates, or local guidance without routeRevisionPolicy | add source route field, consumer echo, negative fixture, and stale-proof before expanding | planned |

## Simulation Rule

Each simulation assumes the first implementation attempt is too visual or coordinate-driven, then names the smallest recovery path that keeps the source fixture authoritative.

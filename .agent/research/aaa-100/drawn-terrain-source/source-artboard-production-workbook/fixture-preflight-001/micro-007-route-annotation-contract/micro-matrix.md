# Route Annotation Contract Micro Matrix

Status: active docs-only
Parent atom: `007-route-annotation-contract`

## Purpose

Track the 12 micro-steps required before future code can safely claim the terrain fixture has usable route annotations.

| ID | Micro atom | Source field | Required proof | State |
| --- | --- | --- | --- | --- |
| 001 | [Primary Route Schema](micro/001-primary-route-schema.md) | primaryRoute | validator proves the fixture exposes one source-owned primary prospecting route with id, points, corridor width, direction, and revision | planned |
| 002 | [Alternate Route Schema](micro/002-alternate-route-schema.md) | alternateRoutes | validator proves alternate routes have id, purpose, connection points, cost/risk tags, and source revision | planned |
| 003 | [Branch And Return Lane Schema](micro/003-branch-and-return-lane-schema.md) | branchReturnLanes | validator proves branch lanes and return lanes connect route segments to mine, town, rail, cashout, and cover approach points | planned |
| 004 | [Route Node And Segment Id](micro/004-route-node-and-segment-id.md) | routeNodesAndSegments | every route point can report stable node id, segment id, route id, and fixture revision | planned |
| 005 | [Route Width And Corridor Budget](micro/005-route-width-and-corridor-budget.md) | routeCorridorBudget | source route segments define corridor width, shoulder tolerance, off-route distance, and recovery behavior | planned |
| 006 | [Route Cost Risk And Speed Tags](micro/006-route-cost-risk-and-speed-tags.md) | routeCostRiskTags | route segments expose speed, risk, visibility, cargo, ambush, and extraction pressure tags as closed source-owned values | planned |
| 007 | [Get Zone At Route Query](micro/007-get-zone-at-route-query.md) | getZoneAtRouteQuery | getZoneAt reports route id, segment id, lane class, distance to center, and route tags at named proof points | planned |
| 008 | [Route Proof Points](micro/008-route-proof-points.md) | routeProofPoints | fixture names proof points for start, fork, branch, mine approach, town approach, cashout approach, return lane, and off-route failure | planned |
| 009 | [Player Guidance Consumer Parity](micro/009-player-guidance-consumer-parity.md) | playerRouteGuidanceEcho | player guidance snapshots echo route id, segment id, next node, lane class, route tags, and fixture revision | planned |
| 010 | [AI Staging Route Parity](micro/010-ai-staging-route-parity.md) | aiRouteStagingEcho | bot staging route descriptors echo source route ids, segment ids, lane classes, and risk tags | planned |
| 011 | [Route Negative Fixture Cases](micro/011-route-negative-fixture-cases.md) | routeNegativeCases | validator fails missing primary routes, disconnected branches, duplicate segment ids, unknown tags, zero-width corridors, and stale consumer echoes | planned |
| 012 | [Route Stale Proof](micro/012-route-stale-proof.md) | routeRevisionPolicy | route source changes mark player guidance, AI staging, gameplay zones, screenshots, simulator proof, and public proof stale | planned |

## Use Rule

Future implementation should start at 001 and stop whenever a validator can pass without proving source-owned route identity, route tags, proof points, consumer echo, and stale-proof behavior.

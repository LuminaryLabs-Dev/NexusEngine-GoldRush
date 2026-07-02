# Walkable Blocker Mask Contract Micro Matrix

Status: active docs-only
Parent atom: `006-walkable-blocker-mask-contract`

## Purpose

Track the 12 micro-steps required before future code can safely claim the terrain fixture has usable walkable and blocker masks.

| ID | Micro atom | Source field | Required proof | State |
| --- | --- | --- | --- | --- |
| 001 | [Walkable Mask Schema](micro/001-walkable-mask-schema.md) | walkableMask | validator proves every fixture cell reports walkable, slow, slide, blocked, edge, or unknown with an explicit reason | planned |
| 002 | [Blocker Mask Schema](micro/002-blocker-mask-schema.md) | blockerMask | validator proves every blocker cell reports blocker id, class, reason, and source revision | planned |
| 003 | [Walkability Class Taxonomy](micro/003-walkability-class-taxonomy.md) | walkabilityClasses | source fixture exposes a closed class set for walkable, slow, slide, blocked, edge, and unknown | planned |
| 004 | [Blocker Class Taxonomy](micro/004-blocker-class-taxonomy.md) | blockerClasses | source fixture exposes a closed blocker set for mountain, cliff, hole, ledge, structure, water, and out-of-bounds | planned |
| 005 | [Slope Walkability Link](micro/005-slope-walkability-link.md) | slopeWalkabilityRule | slope class thresholds map to walkability classes without local movement-only overrides | planned |
| 006 | [Terrain Hole And Overhang Policy](micro/006-terrain-hole-and-overhang-policy.md) | holeOverhangPolicy | fixture declares whether holes, ledges, bridges, and overhangs are rejected, bridged, or unsupported for this slice | planned |
| 007 | [Movement Rejection Consumer Parity](micro/007-movement-rejection-consumer-parity.md) | movementWalkabilityEcho | movement snapshot echoes source walkability class, blocker id, rejection reason, and fixture revision | planned |
| 008 | [Placement Rejection Consumer Parity](micro/008-placement-rejection-consumer-parity.md) | placementWalkabilityEcho | placement snapshot echoes source walkability class and blocker reason for accepted and rejected anchors | planned |
| 009 | [AI Route And Bot Staging Parity](micro/009-ai-route-and-bot-staging-parity.md) | aiRouteWalkabilityEcho | bot staging and route descriptors echo walkable and blocker classes for proof points | planned |
| 010 | [Edge And Transition Policy](micro/010-edge-and-transition-policy.md) | walkabilityEdgePolicy | source fixture defines boundary tolerance, class transitions, edge cells, and recovery behavior | planned |
| 011 | [Walkable Blocker Negative Cases](micro/011-walkable-blocker-negative-cases.md) | walkableBlockerNegativeCases | validator fails missing masks, unknown classes, contradictory slope rules, blocked accepted placement, and stale consumer echoes | planned |
| 012 | [Walkable Blocker Stale Proof](micro/012-walkable-blocker-stale-proof.md) | walkableBlockerRevisionPolicy | walkable or blocker changes mark movement, placement, AI, collider, screenshot, simulator, and public proof stale | planned |

## Use Rule

Future implementation should start at 001 and stop whenever a validator can pass without proving source-owned walkability, blocker identity, rejection behavior, and consumer echo.

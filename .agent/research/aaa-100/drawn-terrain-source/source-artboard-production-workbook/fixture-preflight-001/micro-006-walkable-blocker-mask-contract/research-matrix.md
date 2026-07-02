# Walkable Blocker Mask Contract Research Matrix

Status: active docs-only
Parent atom: `006-walkable-blocker-mask-contract`

## Purpose

Track one research note per walkable/blocker micro-step before implementation starts.

| ID | Research note | External signal | Local implication | State |
| --- | --- | --- | --- | --- |
| 001 | [Walkable Mask Schema Research](research/001-walkable-mask-schema-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | walkableMask must be source-owned and echoed by consumers | planned |
| 002 | [Blocker Mask Schema Research](research/002-blocker-mask-schema-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | blockerMask must be source-owned and echoed by consumers | planned |
| 003 | [Walkability Class Taxonomy Research](research/003-walkability-class-taxonomy-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | walkabilityClasses must be source-owned and echoed by consumers | planned |
| 004 | [Blocker Class Taxonomy Research](research/004-blocker-class-taxonomy-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | blockerClasses must be source-owned and echoed by consumers | planned |
| 005 | [Slope Walkability Link Research](research/005-slope-walkability-link-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | slopeWalkabilityRule must be source-owned and echoed by consumers | planned |
| 006 | [Terrain Hole And Overhang Policy Research](research/006-terrain-hole-and-overhang-policy-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | holeOverhangPolicy must be source-owned and echoed by consumers | planned |
| 007 | [Movement Rejection Consumer Parity Research](research/007-movement-rejection-consumer-parity-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | movementWalkabilityEcho must be source-owned and echoed by consumers | planned |
| 008 | [Placement Rejection Consumer Parity Research](research/008-placement-rejection-consumer-parity-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | placementWalkabilityEcho must be source-owned and echoed by consumers | planned |
| 009 | [AI Route And Bot Staging Parity Research](research/009-ai-route-and-bot-staging-parity-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | aiRouteWalkabilityEcho must be source-owned and echoed by consumers | planned |
| 010 | [Edge And Transition Policy Research](research/010-edge-and-transition-policy-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | walkabilityEdgePolicy must be source-owned and echoed by consumers | planned |
| 011 | [Walkable Blocker Negative Cases Research](research/011-walkable-blocker-negative-cases-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | walkableBlockerNegativeCases must be source-owned and echoed by consumers | planned |
| 012 | [Walkable Blocker Stale Proof Research](research/012-walkable-blocker-stale-proof-research.md) | walkability, terrain collision, battle royale staging, or engine modularity | walkableBlockerRevisionPolicy must be source-owned and echoed by consumers | planned |

## Research Rule

Use external sources to find missing surfaces and constraints. Do not turn this into a general engine plan; keep every implication scoped to the GoldRush terrain fixture and its kits.

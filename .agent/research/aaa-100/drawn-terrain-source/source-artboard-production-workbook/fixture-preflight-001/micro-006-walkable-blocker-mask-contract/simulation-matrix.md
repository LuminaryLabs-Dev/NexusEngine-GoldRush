# Walkable Blocker Mask Contract Simulation Matrix

Status: active docs-only
Parent atom: `006-walkable-blocker-mask-contract`

## Purpose

Track one implementation simulation per walkable/blocker micro-step.

| ID | Simulation | First expected failure | Recovery idea | State |
| --- | --- | --- | --- | --- |
| 001 | [Walkable Mask Schema Simulation](simulations/001-walkable-mask-schema-simulation.md) | consumer accepts height or visual geometry without walkableMask | add source query, consumer echo, and negative fixture before expanding | planned |
| 002 | [Blocker Mask Schema Simulation](simulations/002-blocker-mask-schema-simulation.md) | consumer accepts height or visual geometry without blockerMask | add source query, consumer echo, and negative fixture before expanding | planned |
| 003 | [Walkability Class Taxonomy Simulation](simulations/003-walkability-class-taxonomy-simulation.md) | consumer accepts height or visual geometry without walkabilityClasses | add source query, consumer echo, and negative fixture before expanding | planned |
| 004 | [Blocker Class Taxonomy Simulation](simulations/004-blocker-class-taxonomy-simulation.md) | consumer accepts height or visual geometry without blockerClasses | add source query, consumer echo, and negative fixture before expanding | planned |
| 005 | [Slope Walkability Link Simulation](simulations/005-slope-walkability-link-simulation.md) | consumer accepts height or visual geometry without slopeWalkabilityRule | add source query, consumer echo, and negative fixture before expanding | planned |
| 006 | [Terrain Hole And Overhang Policy Simulation](simulations/006-terrain-hole-and-overhang-policy-simulation.md) | consumer accepts height or visual geometry without holeOverhangPolicy | add source query, consumer echo, and negative fixture before expanding | planned |
| 007 | [Movement Rejection Consumer Parity Simulation](simulations/007-movement-rejection-consumer-parity-simulation.md) | consumer accepts height or visual geometry without movementWalkabilityEcho | add source query, consumer echo, and negative fixture before expanding | planned |
| 008 | [Placement Rejection Consumer Parity Simulation](simulations/008-placement-rejection-consumer-parity-simulation.md) | consumer accepts height or visual geometry without placementWalkabilityEcho | add source query, consumer echo, and negative fixture before expanding | planned |
| 009 | [AI Route And Bot Staging Parity Simulation](simulations/009-ai-route-and-bot-staging-parity-simulation.md) | consumer accepts height or visual geometry without aiRouteWalkabilityEcho | add source query, consumer echo, and negative fixture before expanding | planned |
| 010 | [Edge And Transition Policy Simulation](simulations/010-edge-and-transition-policy-simulation.md) | consumer accepts height or visual geometry without walkabilityEdgePolicy | add source query, consumer echo, and negative fixture before expanding | planned |
| 011 | [Walkable Blocker Negative Cases Simulation](simulations/011-walkable-blocker-negative-cases-simulation.md) | consumer accepts height or visual geometry without walkableBlockerNegativeCases | add source query, consumer echo, and negative fixture before expanding | planned |
| 012 | [Walkable Blocker Stale Proof Simulation](simulations/012-walkable-blocker-stale-proof-simulation.md) | consumer accepts height or visual geometry without walkableBlockerRevisionPolicy | add source query, consumer echo, and negative fixture before expanding | planned |

## Simulation Rule

Each simulation assumes the first implementation attempt is too permissive, then names the smallest recovery path that keeps the source fixture authoritative.

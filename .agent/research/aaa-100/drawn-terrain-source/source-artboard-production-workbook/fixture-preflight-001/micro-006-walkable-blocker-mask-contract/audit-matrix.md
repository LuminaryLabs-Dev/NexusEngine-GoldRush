# Walkable Blocker Mask Contract Audit Matrix

Status: active docs-only
Parent atom: `006-walkable-blocker-mask-contract`

## Purpose

Track one hardening audit per walkable/blocker micro-step.

| ID | Audit | Highest risk | Hardening proof | State |
| --- | --- | --- | --- | --- |
| 001 | [Walkable Mask Schema Audit](audits/001-walkable-mask-schema-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 002 | [Blocker Mask Schema Audit](audits/002-blocker-mask-schema-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 003 | [Walkability Class Taxonomy Audit](audits/003-walkability-class-taxonomy-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 004 | [Blocker Class Taxonomy Audit](audits/004-blocker-class-taxonomy-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 005 | [Slope Walkability Link Audit](audits/005-slope-walkability-link-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 006 | [Terrain Hole And Overhang Policy Audit](audits/006-terrain-hole-and-overhang-policy-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 007 | [Movement Rejection Consumer Parity Audit](audits/007-movement-rejection-consumer-parity-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 008 | [Placement Rejection Consumer Parity Audit](audits/008-placement-rejection-consumer-parity-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 009 | [AI Route And Bot Staging Parity Audit](audits/009-ai-route-and-bot-staging-parity-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 010 | [Edge And Transition Policy Audit](audits/010-edge-and-transition-policy-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 011 | [Walkable Blocker Negative Cases Audit](audits/011-walkable-blocker-negative-cases-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |
| 012 | [Walkable Blocker Stale Proof Audit](audits/012-walkable-blocker-stale-proof-audit.md) | fake terrain proof through permissive defaults | fail negative fixture and require source revision echo | planned |

## Audit Rule

Every audit should ask whether the player, object placement, AI staging, collider, screenshot proof, and public proof can all explain the same blocked or walkable decision.

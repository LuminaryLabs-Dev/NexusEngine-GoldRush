# Mine And Gold Annotation Contract Simulation Matrix

Status: active docs-only
Parent atom: `008-mine-and-gold-annotation-contract`

## Purpose

Run a docs-only implementation rehearsal for every mine/gold micro-step before code is allowed.

| ID | Simulation packet | Source field | Simulated implementation question | State |
| --- | --- | --- | --- | --- |
| 001 | [Mine Site Schema Simulation](simulations/001-mine-site-schema-simulation.md) | mineSites | what breaks if mineSites is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 002 | [Gold Seam Schema Simulation](simulations/002-gold-seam-schema-simulation.md) | goldSeams | what breaks if goldSeams is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 003 | [Resource Node Id Contract Simulation](simulations/003-resource-node-id-contract-simulation.md) | resourceNodeIds | what breaks if resourceNodeIds is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 004 | [Gold Yield And Tier Tags Simulation](simulations/004-gold-yield-and-tier-tags-simulation.md) | goldYieldTierTags | what breaks if goldYieldTierTags is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 005 | [Mine Approach And Workspace Simulation](simulations/005-mine-approach-and-workspace-simulation.md) | mineApproachWorkspace | what breaks if mineApproachWorkspace is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 006 | [Resource Visibility And Silhouette Tags Simulation](simulations/006-resource-visibility-and-silhouette-tags-simulation.md) | resourceReadabilityTags | what breaks if resourceReadabilityTags is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 007 | [Mine Interaction Anchor Query Simulation](simulations/007-mine-interaction-anchor-query-simulation.md) | mineInteractionAnchorQuery | what breaks if mineInteractionAnchorQuery is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 008 | [Gold Node Placement Consumer Parity Simulation](simulations/008-gold-node-placement-consumer-parity-simulation.md) | goldNodePlacementEcho | what breaks if goldNodePlacementEcho is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 009 | [Mine Hold Action Consumer Parity Simulation](simulations/009-mine-hold-action-consumer-parity-simulation.md) | mineHoldActionEcho | what breaks if mineHoldActionEcho is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 010 | [Cargo And Receipt Consumer Parity Simulation](simulations/010-cargo-and-receipt-consumer-parity-simulation.md) | cargoReceiptEcho | what breaks if cargoReceiptEcho is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 011 | [Mine Gold Negative Fixture Cases Simulation](simulations/011-mine-gold-negative-fixture-cases-simulation.md) | mineGoldNegativeCases | what breaks if mineGoldNegativeCases is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |
| 012 | [Mine Gold Stale Proof Simulation](simulations/012-mine-gold-stale-proof-simulation.md) | mineGoldRevisionPolicy | what breaks if mineGoldRevisionPolicy is introduced into source, renderer, interaction, cargo, scoring, and proof consumers | planned |

## Use Rule

Future implementation should read the simulation before code and treat any fakeout, hardcoded coordinate, renderer-only marker, stale revision, or narrow proof as a stop condition.

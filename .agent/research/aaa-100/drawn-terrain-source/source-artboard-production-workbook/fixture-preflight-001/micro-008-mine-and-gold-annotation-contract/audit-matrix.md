# Mine And Gold Annotation Contract Audit Matrix

Status: active docs-only
Parent atom: `008-mine-and-gold-annotation-contract`

## Purpose

Attach a hardening audit to every mine/gold micro-step so future code cannot claim resource gameplay from unowned markers or helper-only state.

| ID | Audit packet | Source field | Hardening focus | State |
| --- | --- | --- | --- | --- |
| 001 | [Mine Site Schema Audit](audits/001-mine-site-schema-audit.md) | mineSites | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 002 | [Gold Seam Schema Audit](audits/002-gold-seam-schema-audit.md) | goldSeams | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 003 | [Resource Node Id Contract Audit](audits/003-resource-node-id-contract-audit.md) | resourceNodeIds | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 004 | [Gold Yield And Tier Tags Audit](audits/004-gold-yield-and-tier-tags-audit.md) | goldYieldTierTags | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 005 | [Mine Approach And Workspace Audit](audits/005-mine-approach-and-workspace-audit.md) | mineApproachWorkspace | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 006 | [Resource Visibility And Silhouette Tags Audit](audits/006-resource-visibility-and-silhouette-tags-audit.md) | resourceReadabilityTags | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 007 | [Mine Interaction Anchor Query Audit](audits/007-mine-interaction-anchor-query-audit.md) | mineInteractionAnchorQuery | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 008 | [Gold Node Placement Consumer Parity Audit](audits/008-gold-node-placement-consumer-parity-audit.md) | goldNodePlacementEcho | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 009 | [Mine Hold Action Consumer Parity Audit](audits/009-mine-hold-action-consumer-parity-audit.md) | mineHoldActionEcho | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 010 | [Cargo And Receipt Consumer Parity Audit](audits/010-cargo-and-receipt-consumer-parity-audit.md) | cargoReceiptEcho | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 011 | [Mine Gold Negative Fixture Cases Audit](audits/011-mine-gold-negative-fixture-cases-audit.md) | mineGoldNegativeCases | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |
| 012 | [Mine Gold Stale Proof Audit](audits/012-mine-gold-stale-proof-audit.md) | mineGoldRevisionPolicy | source ownership, consumer echo, player-view proof, negative cases, and stale-proof behavior | planned |

## Audit Rule

The audit fails if mining, gold visuals, cargo, scoring, replay, or public proof can succeed without naming the same source annotation id and fixture revision.

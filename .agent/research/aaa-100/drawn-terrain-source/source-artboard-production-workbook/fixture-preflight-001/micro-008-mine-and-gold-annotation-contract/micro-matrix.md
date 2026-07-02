# Mine And Gold Annotation Contract Micro Matrix

Status: active docs-only
Parent atom: `008-mine-and-gold-annotation-contract`

## Purpose

Track the 12 micro-steps required before future code can safely claim the terrain fixture has usable mine and gold annotations.

| ID | Micro atom | Source field | Required proof | State |
| --- | --- | --- | --- | --- |
| 001 | [Mine Site Schema](micro/001-mine-site-schema.md) | mineSites | validator proves at least one source-owned mine site with stable id, bounds, approach zone, entry marker, revision, and consumer echo | planned |
| 002 | [Gold Seam Schema](micro/002-gold-seam-schema.md) | goldSeams | validator proves at least one source-owned gold seam with id, shape, depth class, visibility class, yield class, and revision | planned |
| 003 | [Resource Node Id Contract](micro/003-resource-node-id-contract.md) | resourceNodeIds | validator proves every mineable node has a stable source id, annotation id, node id, and revision echo | planned |
| 004 | [Gold Yield And Tier Tags](micro/004-gold-yield-and-tier-tags.md) | goldYieldTierTags | validator proves yield tiers are closed values attached to source annotations and echoed by mining, cargo, and scoring consumers | planned |
| 005 | [Mine Approach And Workspace](micro/005-mine-approach-and-workspace.md) | mineApproachWorkspace | validator proves each mine site exposes approach corridor, work radius, interaction face, blocker margin, and camera clearance | planned |
| 006 | [Resource Visibility And Silhouette Tags](micro/006-resource-visibility-and-silhouette-tags.md) | resourceReadabilityTags | validator proves every mine or seam carries readable silhouette, contrast, distance band, and occlusion risk tags | planned |
| 007 | [Mine Interaction Anchor Query](micro/007-mine-interaction-anchor-query.md) | mineInteractionAnchorQuery | getMineInteractionAnchor returns annotation id, hit position, normal, stance, range, and revision at named proof points | planned |
| 008 | [Gold Node Placement Consumer Parity](micro/008-gold-node-placement-consumer-parity.md) | goldNodePlacementEcho | renderer placement and object protokits echo mine id, seam id, resource node id, raycast hit, and source revision | planned |
| 009 | [Mine Hold Action Consumer Parity](micro/009-mine-hold-action-consumer-parity.md) | mineHoldActionEcho | interaction-hold snapshots echo source annotation id, node id, hold progress, cancel reason, and revision | planned |
| 010 | [Cargo And Receipt Consumer Parity](micro/010-cargo-and-receipt-consumer-parity.md) | cargoReceiptEcho | cargo, receipts, score, replay, and results name the same source mine or seam annotation that produced the gold | planned |
| 011 | [Mine Gold Negative Fixture Cases](micro/011-mine-gold-negative-fixture-cases.md) | mineGoldNegativeCases | validator fails missing mine ids, duplicate seam ids, unknown tier tags, orphan resource nodes, blocked workspaces, and stale consumer echoes | planned |
| 012 | [Mine Gold Stale Proof](micro/012-mine-gold-stale-proof.md) | mineGoldRevisionPolicy | source revision changes mark placement, interaction, cargo, scoring, screenshots, simulator proof, and public proof stale | planned |

## Use Rule

Future implementation should start at 001 and stop whenever a validator can pass without proving source-owned mine identity, gold seam identity, interaction anchors, consumer echo, negative fixture cases, and stale-proof behavior.

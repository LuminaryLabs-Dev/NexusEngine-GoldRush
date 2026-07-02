# Fixture Preflight Audit Matrix

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Track hardening audits for each fixture atom.

| ID | Audit packet | Fake-completion risk |
| --- | --- | --- |
| 001 | [Source Id And Revision audit](audits/001-source-id-and-revision-audit.md) | silent source mutation leaves stale caches active |
| 002 | [Bounds Scale And Origin audit](audits/002-bounds-scale-and-origin-audit.md) | map scale drifts from player movement and 60-player density assumptions |
| 003 | [Height Sample Contract audit](audits/003-height-sample-contract-audit.md) | render and collider derive height from different math |
| 004 | [Normal And Slope Contract audit](audits/004-normal-and-slope-contract-audit.md) | movement treats steep or blocker ground as safe footing |
| 005 | [Material And Biome Mask Contract audit](audits/005-material-and-biome-mask-contract-audit.md) | terrain looks varied but gameplay and audio ignore surface identity |
| 006 | [Walkable Blocker Mask Contract audit](audits/006-walkable-blocker-mask-contract-audit.md) | player or props clip through mountains and steep ridges |
| 007 | [Route Annotation Contract audit](audits/007-route-annotation-contract-audit.md) | the map has objectives but no readable path web |
| 008 | [Mine And Gold Annotation Contract audit](audits/008-mine-and-gold-annotation-contract-audit.md) | mining remains a hardcoded marker detached from authored terrain |
| 009 | [Cover And Pressure Annotation Contract audit](audits/009-cover-and-pressure-annotation-contract-audit.md) | combat pressure spawns without readable counterplay |
| 010 | [Cashout And Extraction Annotation Contract audit](audits/010-cashout-and-extraction-annotation-contract-audit.md) | extraction works structurally but not as a map-authored destination |
| 011 | [Rail And Train Reference Contract audit](audits/011-rail-and-train-reference-contract-audit.md) | the train sequence feels disconnected from the match map |
| 012 | [Asset Anchor Family Contract audit](audits/012-asset-anchor-family-contract-audit.md) | procedural objects remain scatter instead of kit-owned map content |
| 013 | [Placement Raycast Contract audit](audits/013-placement-raycast-contract-audit.md) | objects float, bury, or drift after source revision changes |
| 014 | [LOD Cell Contract audit](audits/014-lod-cell-contract-audit.md) | large terrain pops, seams, or overdraws without source-owned cells |
| 015 | [Render Consumer Revision Parity audit](audits/015-render-consumer-revision-parity-audit.md) | visual mesh claims source parity while using local terrain math |
| 016 | [Collider Consumer Revision Parity audit](audits/016-collider-consumer-revision-parity-audit.md) | player walks on invisible or mismatched terrain |
| 017 | [Movement Grounding Consumer Parity audit](audits/017-movement-grounding-consumer-parity-audit.md) | camera and player pulse because movement owns different ground truth |
| 018 | [Gameplay Zone Consumer Parity audit](audits/018-gameplay-zone-consumer-parity-audit.md) | receipts prove actions that were not authored into the map |
| 019 | [Snapshot And Event Contract audit](audits/019-snapshot-and-event-contract-audit.md) | debugging source drift requires renderer inspection instead of state |
| 020 | [Reset And Cache Invalidation audit](audits/020-reset-and-cache-invalidation-audit.md) | new source data mixes with old derived state |
| 021 | [CLI Validator Negative Cases audit](audits/021-cli-validator-negative-cases-audit.md) | validation becomes an existence check instead of a source-parity gate |
| 022 | [Human View Proof Anchors audit](audits/022-human-view-proof-anchors-audit.md) | technical screenshots pass while the player cannot read the map |
| 023 | [Public Proof And Deploy Staleness audit](audits/023-public-proof-and-deploy-staleness-audit.md) | local source proof is mistaken for deployed behavior |
| 024 | [Restart Packet And Lessons Loop audit](audits/024-restart-packet-and-lessons-loop-audit.md) | new terrain knowledge is lost between passes |

## Micro Audits

Atom 001 has a deeper audit matrix at `micro-001-source-id-and-revision/audit-matrix.md`. Use it to block fake completion from passing with only a fixture id string and no consumer echo or stale-proof behavior.

Atom 002 has a deeper audit matrix at `micro-002-bounds-scale-and-origin/audit-matrix.md`. Use it to block fake completion from passing with a plausible map size while renderer, collider, LOD, room partition, or gameplay scale still diverge.

Atom 003 has a deeper audit matrix at `micro-003-height-sample-contract/audit-matrix.md`. Use it to block fake completion from passing with plausible heights while render mesh, collider, raycast, movement, placement, or gameplay consumers still derive height separately.

Atom 004 has a deeper audit matrix at `micro-004-normal-and-slope-contract/audit-matrix.md`. Use it to block fake completion from passing with plausible normals or slopes while movement thresholds, placement alignment, route readability, or terrain-footing proof still derive slope separately.

Atom 005 has a deeper audit matrix at `micro-005-material-and-biome-mask-contract/audit-matrix.md`. Use it to block fake completion from passing with plausible material or biome labels while render, audio, VFX, placement, or gameplay consumers still derive surface identity separately.

Atom 006 has a deeper audit matrix at `micro-006-walkable-blocker-mask-contract/audit-matrix.md`. Use it to block fake completion from passing with finite terrain heights or visible blockers while movement, placement, AI staging, collider, camera, or public proof still derive walkability separately.

Atom 007 has a deeper audit matrix at `micro-007-route-annotation-contract/audit-matrix.md`. Use it to block fake completion from passing with visible trails, target coordinates, or local guidance arrows while player guidance, bots, gameplay routes, screenshots, simulator proof, or public proof still derive route data separately.

Atom 008 has a deeper audit matrix at `micro-008-mine-and-gold-annotation-contract/audit-matrix.md`. Use it to block fake completion from passing with visible gold props, rings, direct mining helpers, or local scoring values while renderer placement, interaction hold, cargo, scoring, replay, screenshots, simulator proof, or public proof still derive resource data separately.

Atom 009 has a deeper audit matrix at `micro-009-cover-and-pressure-annotation-contract/audit-matrix.md`. Use it to block fake completion from passing with visible threat lanes, spawned ambushes, direct combat helpers, or local pressure values while renderer telegraphs, combat routing, receipts, replay, screenshots, simulator proof, or public proof still derive combat pressure separately.

Atom 010 has a deeper audit matrix at `micro-010-cashout-and-extraction-annotation-contract/audit-matrix.md`. Use it to block fake completion from passing with visible cashout rings, direct extraction helpers, or local scoring values while renderer markers, extraction holds, receipts, scoring, replay, screenshots, simulator proof, or public proof still derive destination data separately.

Atom 011 has a deeper audit matrix at `micro-011-rail-and-train-reference-contract/audit-matrix.md`. Use it to block fake completion from passing with visible rails, moving train meshes, direct boarding helpers, timer-driven train motion, or camera-only proof while scene flow, train path, rail terrain parity, camera handoff, audio cues, screenshots, simulator proof, or public proof still derive train data separately.

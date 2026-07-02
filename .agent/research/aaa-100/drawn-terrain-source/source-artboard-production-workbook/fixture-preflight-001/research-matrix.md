# Fixture Preflight Research Matrix

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Track the research note paired to each fixture atom.

| ID | Research packet | Domain | Main risk being constrained |
| --- | --- | --- | --- |
| 001 | [Source Id And Revision research](research/001-source-id-and-revision-research.md) | world/runtime | silent source mutation leaves stale caches active |
| 002 | [Bounds Scale And Origin research](research/002-bounds-scale-and-origin-research.md) | world/network | map scale drifts from player movement and 60-player density assumptions |
| 003 | [Height Sample Contract research](research/003-height-sample-contract-research.md) | world/physics | render and collider derive height from different math |
| 004 | [Normal And Slope Contract research](research/004-normal-and-slope-contract-research.md) | world/control | movement treats steep or blocker ground as safe footing |
| 005 | [Material And Biome Mask Contract research](research/005-material-and-biome-mask-contract-research.md) | world/render/audio | terrain looks varied but gameplay and audio ignore surface identity |
| 006 | [Walkable Blocker Mask Contract research](research/006-walkable-blocker-mask-contract-research.md) | world/physics/navigation | player or props clip through mountains and steep ridges |
| 007 | [Route Annotation Contract research](research/007-route-annotation-contract-research.md) | world/gameplay | the map has objectives but no readable path web |
| 008 | [Mine And Gold Annotation Contract research](research/008-mine-and-gold-annotation-contract-research.md) | gameplay/world | mining remains a hardcoded marker detached from authored terrain |
| 009 | [Cover And Pressure Annotation Contract research](research/009-cover-and-pressure-annotation-contract-research.md) | combat/world | combat pressure spawns without readable counterplay |
| 010 | [Cashout And Extraction Annotation Contract research](research/010-cashout-and-extraction-annotation-contract-research.md) | gameplay/match | extraction works structurally but not as a map-authored destination |
| 011 | [Rail And Train Reference Contract research](research/011-rail-and-train-reference-contract-research.md) | scene/world | the train sequence feels disconnected from the match map |
| 012 | [Asset Anchor Family Contract research](research/012-asset-anchor-family-contract-research.md) | content/world | procedural objects remain scatter instead of kit-owned map content |
| 013 | [Placement Raycast Contract research](research/013-placement-raycast-contract-research.md) | world/content | objects float, bury, or drift after source revision changes |
| 014 | [LOD Cell Contract research](research/014-lod-cell-contract-research.md) | render/performance | large terrain pops, seams, or overdraws without source-owned cells |
| 015 | [Render Consumer Revision Parity research](research/015-render-consumer-revision-parity-research.md) | render/runtime | visual mesh claims source parity while using local terrain math |
| 016 | [Collider Consumer Revision Parity research](research/016-collider-consumer-revision-parity-research.md) | physics/runtime | player walks on invisible or mismatched terrain |
| 017 | [Movement Grounding Consumer Parity research](research/017-movement-grounding-consumer-parity-research.md) | control/physics | camera and player pulse because movement owns different ground truth |
| 018 | [Gameplay Zone Consumer Parity research](research/018-gameplay-zone-consumer-parity-research.md) | gameplay/runtime | receipts prove actions that were not authored into the map |
| 019 | [Snapshot And Event Contract research](research/019-snapshot-and-event-contract-research.md) | runtime/events | debugging source drift requires renderer inspection instead of state |
| 020 | [Reset And Cache Invalidation research](research/020-reset-and-cache-invalidation-research.md) | runtime/versioning | new source data mixes with old derived state |
| 021 | [CLI Validator Negative Cases research](research/021-cli-validator-negative-cases-research.md) | validation | validation becomes an existence check instead of a source-parity gate |
| 022 | [Human View Proof Anchors research](research/022-human-view-proof-anchors-research.md) | validation/player-view | technical screenshots pass while the player cannot read the map |
| 023 | [Public Proof And Deploy Staleness research](research/023-public-proof-and-deploy-staleness-research.md) | release/validation | local source proof is mistaken for deployed behavior |
| 024 | [Restart Packet And Lessons Loop research](research/024-restart-packet-and-lessons-loop-research.md) | production | new terrain knowledge is lost between passes |

## Source Set

Research notes translate official terrain, collider, engine-feature, battle-royale, map, and staging references into GoldRush kit constraints.

## Micro Research

Atom 001 has a deeper research matrix at `micro-001-source-id-and-revision/research-matrix.md`. Read it before implementation of fixture identity or revision drift checks.

Atom 002 has a deeper research matrix at `micro-002-bounds-scale-and-origin/research-matrix.md`. Read it before implementation of world bounds, origin, unit scale, terrain collider scale, LOD distance bands, or room-scale proof.

Atom 003 has a deeper research matrix at `micro-003-height-sample-contract/research-matrix.md`. Read it before implementation of height samples, height normalization, height query APIs, terrain collider parity, movement grounding, or height proof points.

Atom 004 has a deeper research matrix at `micro-004-normal-and-slope-contract/research-matrix.md`. Read it before implementation of normal vectors, slope classes, walkable thresholds, sampleGround API, movement grounding, placement alignment, or slope proof points.

Atom 005 has a deeper research matrix at `micro-005-material-and-biome-mask-contract/research-matrix.md`. Read it before implementation of material masks, biome masks, layer blending, render material selection, audio/VFX surface cues, placement filters, or gameplay surface rules.

Atom 006 has a deeper research matrix at `micro-006-walkable-blocker-mask-contract/research-matrix.md`. Read it before implementation of walkable masks, blocker masks, slope rejection, terrain holes, movement rejection, placement rejection, AI route/staging, or stale navigation proof.

Atom 007 has a deeper research matrix at `micro-007-route-annotation-contract/research-matrix.md`. Read it before implementation of primary routes, alternate routes, branches, return lanes, route tags, getZoneAt queries, player guidance, AI staging, or stale route proof.

Atom 008 has a deeper research matrix at `micro-008-mine-and-gold-annotation-contract/research-matrix.md`. Read it before implementation of mine site schemas, gold seam schemas, resource node identity, yield tiers, mine workspaces, resource readability, interaction anchors, placement echo, hold-action echo, cargo/receipt provenance, negative cases, or stale resource proof.

Atom 009 has a deeper research matrix at `micro-009-cover-and-pressure-annotation-contract/research-matrix.md`. Read it before implementation of cover pocket schemas, threat lane schemas, pressure seeds, sightline tags, route linkage, counterplay, combat proof points, pressure queries, renderer threat echo, combat-loop echo, negative cases, or stale combat proof.

Atom 010 has a deeper research matrix at `micro-010-cashout-and-extraction-annotation-contract/research-matrix.md`. Read it before implementation of cashout site schemas, extraction radius schemas, deposit anchors, return routes, risk/contest tags, readability tags, cashout queries, renderer marker echo, extraction hold echo, receipt/results echo, negative cases, or stale extraction proof.

Atom 011 has a deeper research matrix at `micro-011-rail-and-train-reference-contract/research-matrix.md`. Read it before implementation of rail spline schemas, train stop anchors, loading-yard links, path sampling, boarding sides, motion states, rail/terrain parity, rail prop anchors, camera handoff, audio cues, negative cases, or stale train proof.

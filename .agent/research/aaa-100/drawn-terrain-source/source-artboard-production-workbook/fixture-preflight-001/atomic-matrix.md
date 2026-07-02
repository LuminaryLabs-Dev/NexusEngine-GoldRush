# Fixture Preflight Atomic Matrix

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Track the implementation-sized atom set for the first source-artboard fixture.

| ID | Atom | Domain | Generic kit | GoldRush kit | Required proof | State |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | [Source Id And Revision](atomic/001-source-id-and-revision.md) | world/runtime | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | all consumers echo the same fixtureId and revisionId | planned |
| 002 | [Bounds Scale And Origin](atomic/002-bounds-scale-and-origin.md) | world/network | `n:world:authored-terrain-mesh` | `n:goldrush:desert-world-map` | queries reject points outside bounds and report unit scale | planned |
| 003 | [Height Sample Contract](atomic/003-height-sample-contract.md) | world/physics | `n:world:terrain-heightfield` | `n:goldrush:desert-terrain` | sampleHeight returns finite values from the fixture | planned |
| 004 | [Normal And Slope Contract](atomic/004-normal-and-slope-contract.md) | world/control | `n:world:terrain-raycast` | `n:goldrush:player-grounding` | sampleGround returns normal and slope for every walkable test point | planned |
| 005 | [Material And Biome Mask Contract](atomic/005-material-and-biome-mask-contract.md) | world/render/audio | `n:world:terrain-material-mask` | `n:goldrush:desert-materials` | render, audio, VFX, and placement can name material and biome tags | planned |
| 006 | [Walkable Blocker Mask Contract](atomic/006-walkable-blocker-mask-contract.md) | world/physics/navigation | `n:world:walkability-mask` | `n:goldrush:mountain-blockers` | blocked cells reject grounding and placement unless edge case is named | planned |
| 007 | [Route Annotation Contract](atomic/007-route-annotation-contract.md) | world/gameplay | `n:world:route-annotations` | `n:goldrush:prospector-routes` | getZoneAt reports route tags at proof points | planned |
| 008 | [Mine And Gold Annotation Contract](atomic/008-mine-and-gold-annotation-contract.md) | gameplay/world | `n:world:resource-annotations` | `n:goldrush:gold-seams` | mining marker can be derived from annotation id | planned |
| 009 | [Cover And Pressure Annotation Contract](atomic/009-cover-and-pressure-annotation-contract.md) | combat/world | `n:world:cover-pressure-mask` | `n:goldrush:ambush-pressure` | combat proof can name source cover and pressure ids | planned |
| 010 | [Cashout And Extraction Annotation Contract](atomic/010-cashout-and-extraction-annotation-contract.md) | gameplay/match | `n:world:extraction-zone-mask` | `n:goldrush:cashout-sites` | cashout marker and receipt can report annotation id | planned |
| 011 | [Rail And Train Reference Contract](atomic/011-rail-and-train-reference-contract.md) | scene/world | `n:world:route-spline` | `n:goldrush:train-loading` | train and gold-field source use compatible direction labels | planned |
| 012 | [Asset Anchor Family Contract](atomic/012-asset-anchor-family-contract.md) | content/world | `n:world:placement-anchors` | `n:goldrush:desert-asset-family-protokits` | first prop placement reports anchor id and raycast hit | planned |
| 013 | [Placement Raycast Contract](atomic/013-placement-raycast-contract.md) | world/content | `n:world:placement-raycast` | `n:goldrush:desert-prop-placement` | anchors resolve to grounded transforms on the fixture | planned |
| 014 | [LOD Cell Contract](atomic/014-lod-cell-contract.md) | render/performance | `n:world:terrain-chunks` | `n:goldrush:gold-field-lod` | active camera/player position resolves expected LOD cells | planned |
| 015 | [Render Consumer Revision Parity](atomic/015-render-consumer-revision-parity.md) | render/runtime | `n:render:three-scene` | `n:goldrush:3d-scene-renderer` | render snapshot reports fixture and revision | planned |
| 016 | [Collider Consumer Revision Parity](atomic/016-collider-consumer-revision-parity.md) | physics/runtime | `n:physics:collider` | `n:goldrush:terrain-physics` | collider samples match fixture height at test points | planned |
| 017 | [Movement Grounding Consumer Parity](atomic/017-movement-grounding-consumer-parity.md) | control/physics | `n:control:character-movement` | `n:goldrush:prospector-movement` | local player ground snapshot names fixture revision | planned |
| 018 | [Gameplay Zone Consumer Parity](atomic/018-gameplay-zone-consumer-parity.md) | gameplay/runtime | `n:gameplay:interaction-hold` | `n:goldrush:mine-hold-action` | mine and cashout actions report source annotation ids | planned |
| 019 | [Snapshot And Event Contract](atomic/019-snapshot-and-event-contract.md) | runtime/events | `n:runtime:snapshot` | `n:goldrush:match-snapshot` | runtime snapshot serializes fixture status and consumer drift | planned |
| 020 | [Reset And Cache Invalidation](atomic/020-reset-and-cache-invalidation.md) | runtime/versioning | `n:runtime:snapshot` | `n:goldrush:reality-status` | revision change invalidates render, physics, placement, gameplay, and proof caches | planned |
| 021 | [CLI Validator Negative Cases](atomic/021-cli-validator-negative-cases.md) | validation | `n:runtime:validation` | `n:goldrush:reality-status` | validator fails bad fixtures before passing the good fixture | planned |
| 022 | [Human View Proof Anchors](atomic/022-human-view-proof-anchors.md) | validation/player-view | `n:runtime:validation` | `n:goldrush:human-view-proof` | screenshots label foreground, midground, horizon, next action, and failure state | planned |
| 023 | [Public Proof And Deploy Staleness](atomic/023-public-proof-and-deploy-staleness.md) | release/validation | `n:runtime:validation` | `n:goldrush:public-proof` | public runtime reports same fixture revision as local proof | planned |
| 024 | [Restart Packet And Lessons Loop](atomic/024-restart-packet-and-lessons-loop.md) | production | `n:runtime:validation` | `n:goldrush:restart-policy` | source revision changes create a restart packet and update lesson only when behavior changes | planned |

## Use Rule

Before runtime implementation, read the atom plus its matching research, simulation, and audit packet.

## Micro Runway

Atom 001 has a deeper docs-only micro-runway at `micro-001-source-id-and-revision/`. Use `micro-matrix.md` there before coding source identity or revision behavior.

Atom 002 has a deeper docs-only micro-runway at `micro-002-bounds-scale-and-origin/`. Use `micro-matrix.md` there before coding world bounds, origin, unit scale, cell size, or boundary-query behavior.

Atom 003 has a deeper docs-only micro-runway at `micro-003-height-sample-contract/`. Use `micro-matrix.md` there before coding height samples, height query APIs, interpolation, proof points, or height consumer parity.

Atom 004 has a deeper docs-only micro-runway at `micro-004-normal-and-slope-contract/`. Use `micro-matrix.md` there before coding normal vectors, slope classes, walkable thresholds, sampleGround APIs, movement grounding, or placement parity.

Atom 005 has a deeper docs-only micro-runway at `micro-005-material-and-biome-mask-contract/`. Use `micro-matrix.md` there before coding material masks, biome masks, surface tags, render materials, audio/VFX cues, placement filters, or gameplay surface consumers.

Atom 006 has a deeper docs-only micro-runway at `micro-006-walkable-blocker-mask-contract/`. Use `micro-matrix.md` there before coding walkable masks, blocker masks, movement rejection, placement rejection, bot staging, edge transitions, or terrain-navigation stale-proof behavior.

Atom 007 has a deeper docs-only micro-runway at `micro-007-route-annotation-contract/`. Use `micro-matrix.md` there before coding primary routes, alternate routes, branches, return lanes, route queries, player guidance, AI staging, or route stale-proof behavior.

Atom 008 has a deeper docs-only micro-runway at `micro-008-mine-and-gold-annotation-contract/`. Use `micro-matrix.md` there before coding mine sites, gold seams, resource node ids, yield tiers, interaction anchors, mining hold echoes, cargo receipts, scoring provenance, or resource stale-proof behavior.

Atom 009 has a deeper docs-only micro-runway at `micro-009-cover-and-pressure-annotation-contract/`. Use `micro-matrix.md` there before coding cover pockets, threat lanes, pressure seeds, sightline tags, counterplay, combat proof points, renderer echoes, combat-loop echoes, or combat stale-proof behavior.

Atom 010 has a deeper docs-only micro-runway at `micro-010-cashout-and-extraction-annotation-contract/`. Use `micro-matrix.md` there before coding cashout sites, extraction radii, deposit anchors, return routes, cashout tags, renderer markers, extraction holds, receipt echoes, results echoes, or extraction stale-proof behavior.

Atom 011 has a deeper docs-only micro-runway at `micro-011-rail-and-train-reference-contract/`. Use `micro-matrix.md` there before coding rail splines, train stops, loading-yard links, train path queries, boarding sides, motion states, rail terrain parity, camera handoff, train audio cues, or rail stale-proof behavior.

# Fixture Preflight Simulation Matrix

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Track the dry-run implementation simulation paired to each fixture atom.

| ID | Simulation packet | Simulated pass target |
| --- | --- | --- |
| 001 | [Source Id And Revision simulation](simulations/001-source-id-and-revision-simulation.md) | all consumers echo the same fixtureId and revisionId |
| 002 | [Bounds Scale And Origin simulation](simulations/002-bounds-scale-and-origin-simulation.md) | queries reject points outside bounds and report unit scale |
| 003 | [Height Sample Contract simulation](simulations/003-height-sample-contract-simulation.md) | sampleHeight returns finite values from the fixture |
| 004 | [Normal And Slope Contract simulation](simulations/004-normal-and-slope-contract-simulation.md) | sampleGround returns normal and slope for every walkable test point |
| 005 | [Material And Biome Mask Contract simulation](simulations/005-material-and-biome-mask-contract-simulation.md) | render, audio, VFX, and placement can name material and biome tags |
| 006 | [Walkable Blocker Mask Contract simulation](simulations/006-walkable-blocker-mask-contract-simulation.md) | blocked cells reject grounding and placement unless edge case is named |
| 007 | [Route Annotation Contract simulation](simulations/007-route-annotation-contract-simulation.md) | getZoneAt reports route tags at proof points |
| 008 | [Mine And Gold Annotation Contract simulation](simulations/008-mine-and-gold-annotation-contract-simulation.md) | mining marker can be derived from annotation id |
| 009 | [Cover And Pressure Annotation Contract simulation](simulations/009-cover-and-pressure-annotation-contract-simulation.md) | combat proof can name source cover and pressure ids |
| 010 | [Cashout And Extraction Annotation Contract simulation](simulations/010-cashout-and-extraction-annotation-contract-simulation.md) | cashout marker and receipt can report annotation id |
| 011 | [Rail And Train Reference Contract simulation](simulations/011-rail-and-train-reference-contract-simulation.md) | train and gold-field source use compatible direction labels |
| 012 | [Asset Anchor Family Contract simulation](simulations/012-asset-anchor-family-contract-simulation.md) | first prop placement reports anchor id and raycast hit |
| 013 | [Placement Raycast Contract simulation](simulations/013-placement-raycast-contract-simulation.md) | anchors resolve to grounded transforms on the fixture |
| 014 | [LOD Cell Contract simulation](simulations/014-lod-cell-contract-simulation.md) | active camera/player position resolves expected LOD cells |
| 015 | [Render Consumer Revision Parity simulation](simulations/015-render-consumer-revision-parity-simulation.md) | render snapshot reports fixture and revision |
| 016 | [Collider Consumer Revision Parity simulation](simulations/016-collider-consumer-revision-parity-simulation.md) | collider samples match fixture height at test points |
| 017 | [Movement Grounding Consumer Parity simulation](simulations/017-movement-grounding-consumer-parity-simulation.md) | local player ground snapshot names fixture revision |
| 018 | [Gameplay Zone Consumer Parity simulation](simulations/018-gameplay-zone-consumer-parity-simulation.md) | mine and cashout actions report source annotation ids |
| 019 | [Snapshot And Event Contract simulation](simulations/019-snapshot-and-event-contract-simulation.md) | runtime snapshot serializes fixture status and consumer drift |
| 020 | [Reset And Cache Invalidation simulation](simulations/020-reset-and-cache-invalidation-simulation.md) | revision change invalidates render, physics, placement, gameplay, and proof caches |
| 021 | [CLI Validator Negative Cases simulation](simulations/021-cli-validator-negative-cases-simulation.md) | validator fails bad fixtures before passing the good fixture |
| 022 | [Human View Proof Anchors simulation](simulations/022-human-view-proof-anchors-simulation.md) | screenshots label foreground, midground, horizon, next action, and failure state |
| 023 | [Public Proof And Deploy Staleness simulation](simulations/023-public-proof-and-deploy-staleness-simulation.md) | public runtime reports same fixture revision as local proof |
| 024 | [Restart Packet And Lessons Loop simulation](simulations/024-restart-packet-and-lessons-loop-simulation.md) | source revision changes create a restart packet and update lesson only when behavior changes |

## Micro Simulations

Atom 001 has a deeper simulation matrix at `micro-001-source-id-and-revision/simulation-matrix.md`. Use it to rehearse fixture identity, consumer echo, stale proof, and restart linkage before implementation.

Atom 002 has a deeper simulation matrix at `micro-002-bounds-scale-and-origin/simulation-matrix.md`. Use it to rehearse coordinate, scale, bounds, origin, query boundary, LOD, partition, and physics/render parity before implementation.

Atom 003 has a deeper simulation matrix at `micro-003-height-sample-contract/simulation-matrix.md`. Use it to rehearse finite height samples, normalization, interpolation, edge queries, proof points, render/collider parity, and stale-proof behavior before implementation.

Atom 004 has a deeper simulation matrix at `micro-004-normal-and-slope-contract/simulation-matrix.md`. Use it to rehearse normal shape, slope class, threshold, sampleGround, movement, placement, negative-case, and stale-proof behavior before implementation.

Atom 005 has a deeper simulation matrix at `micro-005-material-and-biome-mask-contract/simulation-matrix.md`. Use it to rehearse source material tags, biome tags, mask weights, blend policy, render/audio/VFX/placement/gameplay consumer echo, negative cases, and stale-proof behavior before implementation.

Atom 006 has a deeper simulation matrix at `micro-006-walkable-blocker-mask-contract/simulation-matrix.md`. Use it to rehearse walkable classes, blocker classes, slope links, hole/overhang policy, movement/placement rejection, AI staging parity, edge behavior, negative cases, and stale-proof behavior before implementation.

Atom 007 has a deeper simulation matrix at `micro-007-route-annotation-contract/simulation-matrix.md`. Use it to rehearse primary routes, alternate routes, branches, return lanes, route ids, corridor budgets, route tags, getZoneAt behavior, player guidance, AI staging, negative cases, and stale-proof behavior before implementation.

Atom 008 has a deeper simulation matrix at `micro-008-mine-and-gold-annotation-contract/simulation-matrix.md`. Use it to rehearse mine sites, gold seams, resource ids, yield tiers, workspaces, resource visibility, interaction anchors, placement echo, hold-action echo, cargo/receipt provenance, negative cases, and stale-proof behavior before implementation.

Atom 009 has a deeper simulation matrix at `micro-009-cover-and-pressure-annotation-contract/simulation-matrix.md`. Use it to rehearse cover pockets, threat lanes, pressure seeds, sightlines, route linkage, counterplay, proof points, pressure queries, renderer echo, combat-loop echo, negative cases, and stale-proof behavior before implementation.

Atom 010 has a deeper simulation matrix at `micro-010-cashout-and-extraction-annotation-contract/simulation-matrix.md`. Use it to rehearse cashout sites, extraction radii, deposit anchors, return routes, risk/contest tags, readability tags, query behavior, renderer markers, extraction holds, receipts, results, negative cases, and stale-proof behavior before implementation.

Atom 011 has a deeper simulation matrix at `micro-011-rail-and-train-reference-contract/simulation-matrix.md`. Use it to rehearse rail splines, train stops, loading-yard links, path sampling, door sides, motion states, rail terrain parity, rail props, camera handoff, audio cues, negative cases, and stale-proof behavior before implementation.

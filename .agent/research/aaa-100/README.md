# AAA 100 Research Packets

Status: active

## Purpose

This folder turns the 100-step AAA roadmap into walkable research packets. Each packet is intentionally small enough to become an implementation packet later, but broad enough to keep the final 60-player wild-west extraction battle royale goal visible.

## Rule

Do not implement from a packet until the packet identifies the owning domain, kit impact, data contract, player-view acceptance, edge cases, and validation gate.

Also do not implement from a packet until the newest version packet in `.agent/version-rebuild-loop/` has a continue-or-increment decision for this turn.

## Tracking Files

- `data-matrix.md`: status and audit gate for all 100 roadmap packets.
- `lessons-matrix.md`: durable lessons and resolved boundaries that should guide restarts.
- `continuous-audit-index.md`: loop for auditing future implementation passes.
- `.agent/version-rebuild-loop/`: strict full-version rebuild loop that decides whether to continue the newest version or create the next ground-up rebuild attempt.
- `authored-map-cluster.md`: active child-packet cluster for the drawn terrain/map-source production shift.
- `authored-map-atomic-matrix.md`: 90 implementation-sized docs-only atoms for the active authored-map cluster.
- `authored-map-atomic-research-matrix.md`: 360 source/domain/data/audit research packets attached to those atoms.
- `authored-terrain-kit-spec/`: implementation-ready docs-only kit contracts for the authored terrain source stack.
- `authored-terrain-kit-spec/implementation-batch-001/`: first code-phase packet batch for terrain source fixtures, LOD, collider parity, raycast placement, consumers, proof, and stop conditions.
- `drawn-terrain-source/`: plateau diagnosis and docs-only source-asset plan for a drawn massive desert terrain mesh with LOD, masks, asset families, and consumer-domain contracts.
- `drawn-terrain-source/atomic-matrix.md`: 48 implementation-sized drawn-terrain source atoms and 48 paired research notes.
- `drawn-terrain-source/source-fixture-authoring/`: first authored terrain fixture schema, layer matrix, validator plan, consumer proof matrix, restart policy, and first map-slice simulation.
- `drawn-terrain-source/source-first-production-gate/`: docs-only production gate that prevents terrain implementation from resuming until render, collider, placement, gameplay, LOD, asset families, and proof all consume one source revision.
- `drawn-terrain-source/massive-desert-map-blueprint/`: docs-only macro map blueprint for the actual massive desert source asset: basin, mesas, POIs, route/risk web, LOD cells, asset anchors, source data, and proof gates.
- `drawn-terrain-source/massive-desert-map-blueprint/atomic-matrix.md`: 48 implementation-sized map blueprint atoms and 48 paired research notes for the massive desert source.
- `drawn-terrain-source/massive-desert-map-blueprint/simulation-matrix.md`: 48 implementation simulations and 48 hardening audits for the massive desert map blueprint atoms.
- `drawn-terrain-source/plateau-breakthrough-terrain-kit/`: docs-only production bridge explaining why the current map is plateauing and defining 64 drawn-terrain kit atoms with paired research, simulations, and audits.
- `drawn-terrain-source/source-artboard-production-workbook/`: docs-only artboard workbook for drawing the terrain source layers, scale, composition, masks, LOD extraction, asset stamps, gameplay annotations, and proof shots before code.
- `drawn-terrain-source/source-artboard-production-workbook/atomic-matrix.md`: 48 source-artboard atoms with 48 paired research notes, 48 implementation simulations, and 48 hardening audits.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/`: docs-only first tiny source-artboard fixture preflight for `goldrush.desert.artboard.fixture.001`, including fields, queries, consumers, validators, human proof, public proof, restart, simulation, and audit.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/atomic-matrix.md`: 24 fixture implementation atoms with 24 paired research notes, 24 implementation simulations, and 24 hardening audits.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-001-source-id-and-revision/`: 12 micro atoms with paired research, simulations, and audits for fixture identity, revision drift, consumer echo, stale proof, and restart linkage.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-002-bounds-scale-and-origin/`: 12 micro atoms with paired research, simulations, and audits for coordinate system, unit scale, playable bounds, origin, cell spacing, vertical range, query boundary behavior, traversal budgets, LOD/partition scale, physics/render parity, and restart policy.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-003-height-sample-contract/`: 12 micro atoms with paired research, simulations, and audits for height array shape, value domain, normalization, origin offset, source cell addressing, interpolation, edge policy, public height query API, proof points, render/collider parity, negative fixtures, and stale proof.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-004-normal-and-slope-contract/`: 12 micro atoms with paired research, simulations, and audits for normal vector shape, normal space, slope domain, slope classes, walkable thresholds, derivation source, gradient neighborhood, sampleGround API, movement parity, placement parity, negative fixtures, and stale proof.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-005-material-and-biome-mask-contract/`: 12 micro atoms with paired research, simulations, and audits for material masks, biome masks, tag taxonomies, mask weights, blend policy, render parity, audio/VFX parity, placement filters, gameplay surface echo, negative fixtures, and stale proof.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-006-walkable-blocker-mask-contract/`: 12 micro atoms with paired research, simulations, and audits for walkable masks, blocker masks, walkability classes, blocker classes, slope linkage, hole/overhang policy, movement rejection, placement rejection, AI staging, edge transitions, negative fixtures, and stale proof.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-007-route-annotation-contract/`: 12 micro atoms with paired research, simulations, and audits for primary routes, alternate routes, branch/return lanes, route ids, corridor budgets, route tags, getZoneAt queries, proof points, player guidance, AI staging, negative fixtures, and stale proof.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-008-mine-and-gold-annotation-contract/`: 12 micro atoms with paired research, simulations, and audits for mine sites, gold seams, resource node ids, yield tiers, mine workspaces, readability tags, interaction anchors, placement echo, hold-action echo, cargo/receipt provenance, negative fixtures, and stale proof.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-009-cover-and-pressure-annotation-contract/`: 12 micro atoms with paired research, simulations, and audits for cover pockets, threat lanes, pressure seeds, sightline tags, route linkage, counterplay, combat proof points, pressure queries, renderer echoes, combat-loop echoes, negative fixtures, and stale proof.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-010-cashout-and-extraction-annotation-contract/`: 12 micro atoms with paired research, simulations, and audits for cashout sites, extraction radii, deposit anchors, return routes, risk/contest tags, readability tags, cashout queries, renderer marker echoes, extraction hold echoes, receipt/results echoes, negative fixtures, and stale proof.
- `drawn-terrain-source/source-artboard-production-workbook/fixture-preflight-001/micro-011-rail-and-train-reference-contract/`: 12 micro atoms with paired research, simulations, and audits for rail splines, train stops, loading-yard links, path sampling, boarding sides, motion states, rail/terrain parity, rail prop placement, camera handoff, train audio cues, negative fixtures, and stale proof.
- `digital-asset-family-atlas/`: 64 asset-family protokit packets and 64 paired research notes for terrain-grounded toon western assets.
- `free-toon-asset-candidate-expansion/`: docs-only current-source research for free toon model/audio candidates, kit-fit bundles, style adaptation, proof gates, and import-readiness audits.
- `free-toon-asset-candidate-expansion/atomic-matrix.md`: 48 implementation-sized asset candidate atoms and 48 paired research packets for source, license, format, toon adaptation, protokit, and proof gates.
- `free-toon-asset-candidate-expansion/simulation-matrix.md`: 48 implementation simulations and 48 hardening audits for the free-toon asset candidate atoms.
- `asset-promotion-gates/`: 15-phase deny-by-default asset promotion gate set with 60 gate packets and 60 paired research notes.
- `end-to-end-kit-assembly/`: 20 title-to-results kit assembly slices with 80 contract/data/event/proof packets and 80 paired research notes.
- `staging-simulation-lab/`: 18 staging, bot, simulator, 60-player scale, and proof-boundary scenarios with 72 packets and 72 paired research notes.
- `bot-ai-encounter-lab/`: 18 bot, encounter, staging, combat, density, and proof-boundary systems with 72 system packets and 72 paired research packets.
- `live-network-authority-lab/`: 18 live network authority, transport, replication, partition, recovery, fairness, and proof-boundary systems with 72 system packets and 72 paired research packets.
- `minute-interactions/`: 120 player-facing minute interaction packets and 120 paired research packets covering title, lobby, train, movement, terrain, mining, cargo, combat, cashout, and results.
- `player-feel-polish-lab/`: 18 tactile/player-feel axes with 72 contract/player-view/validator/failure-mode packets and 72 paired research packets covering camera, movement, body, audio, VFX, combat, cashout, results, accessibility, and local/public proof.
- `match-economy-retention-lab/`: 16 economy, reward, progression, replay, tuning, fairness, and release-version systems with 64 system packets and 64 paired research packets.
- `.agent/simulations/aaa-100/`: 100 implementation dry-run packets, one per roadmap step.
- `.agent/audits/aaa-100-step-audits/`: 100 hardening audit packets, one per roadmap step.

## Active Cluster

The current active cluster is the authored map source:

```txt
021 terrain intention map
022 top-down terrain plate
023 height/mask data model
024 LOD ring contract
026 collider parity
040 prop protokit library
```

Each active packet now has a child-packet folder with intent, current evidence, reference research, data contract, player view, edge cases, validation, and deploy risk.

The same cluster now has 90 atomic planning packets under each active packet's `atomic/` folder. Each atom also has four research packets under the sibling `atomic-research/` folder: source research, domain implication, data/proof, and edge-case audit. These are the next implementation runway when coding resumes.

Every roadmap step now also has a paired simulation and audit packet. Future implementation passes should read the base research packet, the simulation packet, and the audit packet before touching runtime code.

The authored-map cluster now has a dedicated kit spec folder that names the generic terrain source kit, the GoldRush desert map kit, the source data schema, LOD contract, collider parity contract, placement/raycast contract, gameplay zone contract, consumer event flow, readiness gates, failure modes, and proof/deploy plan.

Implementation batch 001 now turns that kit spec into 24 docs-only packets that can be followed one at a time once runtime implementation is allowed.

The drawn-terrain source packet now explains why the current visual work is plateauing and why the next terrain pass should draw the map source first, then derive LOD chunks, colliders, object-protokit anchors, gameplay masks, and proof fixtures from the same source revision.

The drawn-terrain atomic layer now splits that source-asset decision into 48 small packets with paired research notes so future implementation can start from source fixtures, validators, consumer contracts, and stop conditions instead of a broad terrain rewrite.

The source-fixture authoring packet now names the first tiny `goldrush.desert.fixture.001` slice and the validator/proof gates needed before any live terrain replacement.

The source-first production gate now states the terrain implementation rule plainly: draw or author the source first, then derive renderer chunks, colliders, raycast anchors, gameplay masks, asset families, and public proof from the same source revision.

The massive desert map blueprint now defines what that source revision should become: outer horizon mesas, playable basin, central mountain obstacle, town/mine/rail/extraction shelves, route risk web, terrain layers, LOD cells, object anchors, source data budgets, and human-view gates.

The massive desert map blueprint atomic layer now splits that macro map into 12 implementation families with intent, data, consumer, and proof packets plus paired source-signal, domain-implication, data/proof, and edge-case research notes.

The massive desert map blueprint simulation/audit layer now runs a docs-only implementation simulation and hardening audit for every map atom, so future terrain work has a predicted failure path and a source/consumer/proof hardening gate before code changes.

The plateau breakthrough terrain kit now narrows the map diagnosis into a source-first production bridge: one drawn terrain revision must own macro silhouette, height, masks, LOD cells, collider parity, raycast placement, asset anchors, routes, player readability, combat cover, 60-player scale, toon materials, and proof/restart gates.

The source artboard workbook now defines the concrete drawing contract for that revision: coordinate/scale sheet, macro composition sheet, height/mask authoring sheet, LOD extraction sheet, asset stamp palette, gameplay annotations, proof shot list, implementation gate, and audit checklist.

The source artboard workbook now has an atomic layer, so each map-authoring sheet can be implemented later through one intent/data/consumer/proof atom with matching research, simulation, and hardening audit.

The source artboard fixture preflight now names the first tiny authored map source gate, `goldrush.desert.artboard.fixture.001`, so future code starts from source fields, query contracts, consumer parity, validation, human-view proof, public proof, and restart rules instead of another wide terrain rewrite.

The fixture preflight atomic layer now splits that first gate into 24 source-fixture concerns, so the next code pass can implement source identity, bounds, height, masks, annotations, anchors, raycast placement, LOD, consumer parity, snapshots, reset, validation, human proof, public proof, and restart one atom at a time.

The source identity atom now has a 12-step micro-runway, so implementation can start by proving fixture id, revision id, hash inputs, consumer echo, negative drift cases, source snapshot, identity events, stale-proof flags, and restart packet linkage before any visual terrain replacement.

The bounds, scale, and origin atom now has a 12-step micro-runway, so implementation can prove coordinate system, unit scale, playable bounds, origin anchor, cell spacing, vertical range, boundary query behavior, traversal scale, LOD/partition echo, physics/render parity, and scale restart policy before any large terrain or 60-player staging claim.

The height sample atom now has a 12-step micro-runway, so implementation can prove finite source-owned height samples, normalization, offsets, source cell ids, interpolation, edge behavior, public sampleHeight API shape, named gameplay proof points, render/collider/movement parity, negative fixture cases, and stale-proof behavior before any terrain consumer claims correctness.

The normal and slope atom now has a 12-step micro-runway, so implementation can prove normal vector shape, normal space, slope value domain, slope taxonomy, walkable thresholds, normal derivation, gradient neighborhood, sampleGround API shape, movement parity, placement parity, negative fixture cases, and stale-proof behavior before any movement or placement consumer claims terrain-footing correctness.

The material and biome atom now has a 12-step micro-runway, so implementation can prove material masks, biome masks, tag taxonomies, mask weights, layer blending, render materials, audio/VFX surface cues, placement filters, gameplay surface echo, negative fixture cases, and stale-proof behavior before any consumer claims authored terrain surface identity.

The walkable and blocker atom now has a 12-step micro-runway, so implementation can prove walkable masks, blocker masks, closed class taxonomies, slope linkage, hole/overhang policy, movement rejection, placement rejection, AI route/staging parity, edge transitions, negative fixture cases, and stale-proof behavior before any consumer claims terrain navigation correctness.

The route annotation atom now has a 12-step micro-runway, so implementation can prove primary route, alternate route, branch/return lane, route node/segment ids, route corridor budgets, route cost/risk tags, getZoneAt route queries, named proof points, player guidance parity, AI staging parity, negative fixture cases, and stale-proof behavior before any consumer claims authored traversal correctness.

The mine and gold annotation atom now has a 12-step micro-runway, so implementation can prove mine site schema, gold seam schema, resource node ids, yield tiers, mine approach/workspace, resource readability tags, mine interaction anchors, renderer placement echo, mining hold-action echo, cargo/receipt provenance, negative fixture cases, and stale-proof behavior before any consumer claims authored resource gameplay correctness.

The cover and pressure annotation atom now has a 12-step micro-runway, so implementation can prove cover pocket schema, threat lane schema, pressure seed schema, sightline/occlusion tags, route linkage, counterplay, combat proof points, pressure query API shape, renderer threat echo, combat-loop consumer echo, negative fixture cases, and stale-proof behavior before any consumer claims authored combat readability correctness.

The cashout and extraction annotation atom now has a 12-step micro-runway, so implementation can prove cashout site schema, extraction radius schema, deposit anchor contract, return route linkage, risk/contest tags, readability tags, cashout query API shape, renderer marker parity, extraction hold parity, receipt/results parity, negative fixture cases, and stale-proof behavior before any consumer claims authored extraction destination correctness.

The rail and train reference atom now has a 12-step micro-runway, so implementation can prove rail spline schema, train stop/platform anchors, loading-yard map edge links, train path sampling, boarding side labels, train motion state, rail/terrain parity, rail prop placement, camera handoff, train audio cue provenance, negative fixture cases, and stale-proof behavior before any consumer claims authored train route correctness.

The digital asset family atlas now splits the primitive-replacement problem into terrain-grounded protokit families for ridges, rocks, plants, mines, gold seams, rails, towns, camps, extraction landmarks, cover, cargo/tools, player gear, VFX/SFX cues, sky/horizon, and route signage.

The free toon asset candidate expansion now identifies current candidate source sets for desert scatter, rail/train, character/animation, town/camp, mining/cargo, combat cover, audio, and atmosphere while keeping them blocked from runtime use until source, license, style, protokit, placement, review, and proof gates pass.

The free toon asset candidate atomic layer now breaks those sets into gate-sized docs so later implementation can move one candidate family through source evidence, license provenance, file/format integrity, toon adaptation, protokit contract, and local/public proof without bulk importing.

The free toon asset candidate simulation/audit layer now predicts likely implementation failures for each asset gate and hardens them against source drift, style mismatch, renderer-owned imports, narrow proof, and early runtime promotion.

The asset-promotion gates now define the deny-by-default bridge from candidate source to approved runtime protokit: source, license, provenance, hash, conversion, toon adaptation, transform, performance, protokit registration, terrain placement, collider/interaction, human review, runtime promotion, browser proof, and restart.

The end-to-end kit assembly runway now maps the playable loop into scene/site kit groups, event spine, snapshots, validators, human-view proof seeds, and fakeout registers so future implementation starts from a concrete owner kit instead of a broad feature label.

The staging simulation lab now separates practice mode, training yard, bot fill, dummy squads, 20-player simulation, 60-player simulation, room partition load tests, NexusSimulator proof, Playwright proof, public proof, and future live network proof so scale claims stay honest.

The bot AI encounter lab now turns staging into behavior-rich match pressure: bot roles, deterministic rosters, spawn/fill policy, terrain movement, prospecting, cargo, cashout, threat telegraphs, cover, weapon timing, recovery, encounter pacing, distance bands, survivor density, difficulty personas, simulation reporting, and local/public proof boundaries.

The live network authority lab now defines the non-simulated multiplayer runway: mode policy, party handoff, PeerJS/WebRTC transport boundaries, connection readiness, live authority, host migration, interest management, replication, delta priority, command buffering, prediction/reconciliation, receipt ledger, partition handoff, disconnect/rejoin, latency/jitter/loss simulation, sanity boundaries, live proof, and public deploy network readiness.

The minute interaction atlas now breaks the player-facing loop into 120 atomic actions with owner kits, data seeds, event/snapshot seeds, proof requirements, stop conditions, and paired research notes.

The player feel polish lab now maps the tactile layer between working receipts and AAA player experience: camera authority, mouse look, WASD feel, terrain footing, character rig, animation, mining tactility, cargo weight, resource readability, cashout tension, threat telegraphy, cover counterplay, weapon feedback, audio, diegetic VFX, results payoff, accessibility, and local/public proof.

The match economy retention lab now maps the replayability layer between a working extraction loop and a long-term game: value ladders, gold economy, western tools, claim contracts, risk/reward tiers, extraction stakes, final-rush pressure, squad sharing, bot-fill reward boundaries, replay lessons, progression without grind, optional challenges, identity boundaries, tuning ledgers, fairness, and release-version policy.

## Packet Index

| Step | Packet | Domain | Status |
| --- | --- | --- | --- |
| 001 | [Goal ledger freeze](001-goal-ledger-freeze.md) | governance | planned |
| 002 | [Current state baseline](002-current-state-baseline.md) | governance | planned |
| 003 | [Branch/version model](003-branch-version-model.md) | governance | planned |
| 004 | [Restart packet policy](004-restart-packet-policy.md) | governance | planned |
| 005 | [Kit ownership matrix](005-kit-ownership-matrix.md) | architecture | planned |
| 006 | [Data matrix schema](006-data-matrix-schema.md) | architecture | planned |
| 007 | [ADR and decision log](007-adr-decision-log.md) | architecture | planned |
| 008 | [Public/private API rules](008-public-private-api-rules.md) | architecture | planned |
| 009 | [Scope gates](009-scope-gates.md) | production | planned |
| 010 | [Proof contract](010-proof-contract.md) | validation | planned |
| 011 | [Game-engine feature scan](011-game-engine-feature-scan.md) | research | planned |
| 012 | [Battle royale scan](012-battle-royale-scan.md) | research | planned |
| 013 | [Extraction scan](013-extraction-scan.md) | research | planned |
| 014 | [Visual target packet](014-visual-target-packet.md) | art direction | planned |
| 015 | [Player persona matrix](015-player-persona-matrix.md) | product | planned |
| 016 | [Minute interaction inventory](016-minute-interaction-inventory.md) | design | planned |
| 017 | [Proof taxonomy](017-proof-taxonomy.md) | validation | planned |
| 018 | [Risk register](018-risk-register.md) | production | planned |
| 019 | [Backlog slicing](019-backlog-slicing.md) | production | planned |
| 020 | [Acceptance rubric](020-acceptance-rubric.md) | production | planned |
| 021 | [Terrain intention map](021-terrain-intention-map.md) | world | planned |
| 022 | [Top-down terrain plate](022-top-down-terrain-plate.md) | world | planned |
| 023 | [Height/mask data model](023-height-mask-data-model.md) | world | planned |
| 024 | [LOD ring contract](024-lod-ring-contract.md) | world/render | planned |
| 025 | [Terrain mesh chunking](025-terrain-mesh-chunking.md) | render | planned |
| 026 | [Collider parity](026-collider-parity.md) | physics | planned |
| 027 | [Biome/material masks](027-biome-material-masks.md) | art/world | planned |
| 028 | [Landmark silhouette plan](028-landmark-silhouette-plan.md) | art/world | planned |
| 029 | [Path and rail splines](029-path-rail-splines.md) | world | planned |
| 030 | [Gold-zone placement](030-gold-zone-placement.md) | gameplay/world | planned |
| 031 | [Town/mine camp layout](031-town-mine-camp-layout.md) | world/art | planned |
| 032 | [Cover and ambush layout](032-cover-ambush-layout.md) | combat/world | planned |
| 033 | [Extraction site layout](033-extraction-site-layout.md) | gameplay/world | planned |
| 034 | [Map streaming budget](034-map-streaming-budget.md) | performance | planned |
| 035 | [Terrain proof suite](035-terrain-proof-suite.md) | validation | planned |
| 036 | [Asset source catalog](036-asset-source-catalog.md) | content | planned |
| 037 | [Legacy approval decisions](037-legacy-approval-decisions.md) | content/legal | planned |
| 038 | [GLB conversion pipeline](038-glb-conversion-pipeline.md) | content | planned |
| 039 | [Toon shader policy](039-toon-shader-policy.md) | art/render | planned |
| 040 | [Prop protokit library](040-prop-protokit-library.md) | content | planned |
| 041 | [Rock/plant/clutter kits](041-rock-plant-clutter-kits.md) | content/world | planned |
| 042 | [Train asset kit](042-train-asset-kit.md) | content/scene | planned |
| 043 | [Audio cue promotion](043-audio-cue-promotion.md) | audio | planned |
| 044 | [Music state promotion](044-music-state-promotion.md) | audio | planned |
| 045 | [Asset performance budgets](045-asset-performance-budgets.md) | performance/content | planned |
| 046 | [Rig target](046-rig-target.md) | character | planned |
| 047 | [Player mesh integration](047-player-mesh-integration.md) | character | planned |
| 048 | [Animation state graph](048-animation-state-graph.md) | animation | planned |
| 049 | [Locomotion blend](049-locomotion-blend.md) | animation/control | planned |
| 050 | [Exploration camera complete](050-exploration-camera-complete.md) | control/camera | planned |
| 051 | [Combat camera complete](051-combat-camera-complete.md) | control/camera | planned |
| 052 | [Keyboard/mouse feel](052-keyboard-mouse-feel.md) | control | planned |
| 053 | [Controller/accessibility input](053-controller-accessibility-input.md) | control/accessibility | planned |
| 054 | [Lobby character preview](054-lobby-character-preview.md) | presentation | planned |
| 055 | [Bot/NPC prototypes](055-bot-npc-prototypes.md) | staging/combat | planned |
| 056 | [Interaction hold system](056-interaction-hold-system.md) | gameplay | planned |
| 057 | [Mining object contracts](057-mining-object-contracts.md) | gameplay/content | planned |
| 058 | [Gold economy](058-gold-economy.md) | gameplay | planned |
| 059 | [Cargo carry/drop](059-cargo-carry-drop.md) | gameplay/character | planned |
| 060 | [Deposit/cashout](060-deposit-cashout.md) | gameplay | planned |
| 061 | [Extraction interruption](061-extraction-interruption.md) | gameplay/combat | planned |
| 062 | [Claim ownership](062-claim-ownership.md) | gameplay/network | planned |
| 063 | [Inventory items](063-inventory-items.md) | gameplay | planned |
| 064 | [Equipment/tools](064-equipment-tools.md) | gameplay/content | planned |
| 065 | [Train boarding sequence](065-train-boarding-sequence.md) | scene | planned |
| 066 | [Onboarding/tutorial](066-onboarding-tutorial.md) | UX/staging | planned |
| 067 | [Reward/score receipts](067-reward-score-receipts.md) | match | planned |
| 068 | [Results/replay](068-results-replay.md) | match/presentation | planned |
| 069 | [Progression meta](069-progression-meta.md) | product | planned |
| 070 | [Fail states/recovery](070-fail-states-recovery.md) | gameplay | planned |
| 071 | [Combat mechanics](071-combat-mechanics.md) | combat | planned |
| 072 | [Weapon kit](072-weapon-kit.md) | combat/content | planned |
| 073 | [Health/downed/revive](073-health-downed-revive.md) | combat/team | planned |
| 074 | [Cover system](074-cover-system.md) | combat/world | planned |
| 075 | [Threat AI/bots](075-threat-ai-bots.md) | staging/combat | planned |
| 076 | [Ambush events](076-ambush-events.md) | combat/gameplay | planned |
| 077 | [Final rush/zone pressure](077-final-rush-zone-pressure.md) | battle royale | planned |
| 078 | [60-player partition contracts](078-60-player-partition-contracts.md) | network | planned |
| 079 | [Party lobby and leader](079-party-lobby-leader.md) | network/UX | planned |
| 080 | [Replication snapshots](080-replication-snapshots.md) | network/runtime | planned |
| 081 | [Prediction/reconciliation](081-prediction-reconciliation.md) | network/control | planned |
| 082 | [Disconnect/rejoin](082-disconnect-rejoin.md) | network | planned |
| 083 | [Sanity/anti-cheat boundaries](083-sanity-anti-cheat-boundaries.md) | network/security | planned |
| 084 | [Bot fill/single-player staging](084-bot-fill-single-player-staging.md) | staging | planned |
| 085 | [Matchmaker/private rooms](085-matchmaker-private-rooms.md) | network/product | planned |
| 086 | [Staging environment](086-staging-environment.md) | staging | planned |
| 087 | [Scenario runner](087-scenario-runner.md) | validation | planned |
| 088 | [NexusSimulator suite](088-nexussimulator-suite.md) | validation | planned |
| 089 | [Playwright human-view suite](089-playwright-human-view-suite.md) | validation | planned |
| 090 | [Performance budgets](090-performance-budgets.md) | performance | planned |
| 091 | [Memory/network budget](091-memory-network-budget.md) | performance/network | planned |
| 092 | [Deploy preview policy](092-deploy-preview-policy.md) | release | planned |
| 093 | [Save/replay artifacts](093-save-replay-artifacts.md) | runtime | planned |
| 094 | [Error/crash telemetry](094-error-crash-telemetry.md) | runtime | planned |
| 095 | [QA release gates](095-qa-release-gates.md) | release | planned |
| 096 | [Content polish pass](096-content-polish-pass.md) | art/design | planned |
| 097 | [Accessibility pass](097-accessibility-pass.md) | UX | planned |
| 098 | [Player feedback loop](098-player-feedback-loop.md) | production | planned |
| 099 | [Release packaging](099-release-packaging.md) | release | planned |
| 100 | [Continuous audit loop](100-continuous-audit-loop.md) | production | planned |

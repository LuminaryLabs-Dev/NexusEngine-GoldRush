# AAA 100 Audit Matrix

Status: active docs-only

## Purpose

Route every roadmap row to its hardening audit and matching implementation simulation packet.

| Step | Audit | Domain | Matrix state | Matching simulation | Audit gate |
| --- | --- | --- | --- | --- | --- |
| 001 | [Goal ledger freeze](001-goal-ledger-freeze.md) | governance | planned | [simulation](../../simulations/aaa-100/001-goal-ledger-freeze.md) | Verify future passes do not redefine success |
| 002 | [Current state baseline](002-current-state-baseline.md) | governance | planned | [simulation](../../simulations/aaa-100/002-current-state-baseline.md) | Compare every new pass against baseline |
| 003 | [Branch/version model](003-branch-version-model.md) | governance | planned | [simulation](../../simulations/aaa-100/003-branch-version-model.md) | Simulate bad deploy rollback |
| 004 | [Restart packet policy](004-restart-packet-policy.md) | governance | planned | [simulation](../../simulations/aaa-100/004-restart-packet-policy.md) | New agent can resume without chat memory |
| 005 | [Kit ownership matrix](005-kit-ownership-matrix.md) | architecture | planned | [simulation](../../simulations/aaa-100/005-kit-ownership-matrix.md) | No feature lacks an owning domain |
| 006 | [Data matrix schema](006-data-matrix-schema.md) | architecture | planned | [simulation](../../simulations/aaa-100/006-data-matrix-schema.md) | Matrix catches fake progress |
| 007 | [ADR and decision log](007-adr-decision-log.md) | architecture | planned | [simulation](../../simulations/aaa-100/007-adr-decision-log.md) | Reversals are explicit |
| 008 | [Public/private API rules](008-public-private-api-rules.md) | architecture | planned | [simulation](../../simulations/aaa-100/008-public-private-api-rules.md) | Public API does not become config sprawl |
| 009 | [Scope gates](009-scope-gates.md) | production | planned | [simulation](../../simulations/aaa-100/009-scope-gates.md) | Large changes pause at named gates |
| 010 | [Proof contract](010-proof-contract.md) | validation | planned | [simulation](../../simulations/aaa-100/010-proof-contract.md) | Green proof states exactly what it covers |
| 011 | [Game-engine feature scan](011-game-engine-feature-scan.md) | research | planned | [simulation](../../simulations/aaa-100/011-game-engine-feature-scan.md) | Missing production surfaces are named |
| 012 | [Battle royale scan](012-battle-royale-scan.md) | research | planned | [simulation](../../simulations/aaa-100/012-battle-royale-scan.md) | GoldRush BR needs are explicit |
| 013 | [Extraction scan](013-extraction-scan.md) | research | planned | [simulation](../../simulations/aaa-100/013-extraction-scan.md) | Gold value creates risk decisions |
| 014 | [Visual target packet](014-visual-target-packet.md) | art direction | planned | [simulation](../../simulations/aaa-100/014-visual-target-packet.md) | Prototype visuals cannot pass as final |
| 015 | [Player persona matrix](015-player-persona-matrix.md) | product | planned | [simulation](../../simulations/aaa-100/015-player-persona-matrix.md) | Every persona has a proof path |
| 016 | [Minute interaction inventory](016-minute-interaction-inventory.md) | design | planned | [simulation](../../simulations/aaa-100/016-minute-interaction-inventory.md) | No action remains vague |
| 017 | [Proof taxonomy](017-proof-taxonomy.md) | validation | planned | [simulation](../../simulations/aaa-100/017-proof-taxonomy.md) | Proof type matches feature risk |
| 018 | [Risk register](018-risk-register.md) | production | planned | [simulation](../../simulations/aaa-100/018-risk-register.md) | Highest risks have owners |
| 019 | [Backlog slicing](019-backlog-slicing.md) | production | planned | [simulation](../../simulations/aaa-100/019-backlog-slicing.md) | Multiple agents do not overlap badly |
| 020 | [Acceptance rubric](020-acceptance-rubric.md) | production | planned | [simulation](../../simulations/aaa-100/020-acceptance-rubric.md) | Completion language is consistent |
| 021 | [Terrain intention map](021-terrain-intention-map.md) | world | active | [simulation](../../simulations/aaa-100/021-terrain-intention-map.md) | Map supports extraction and combat |
| 022 | [Top-down terrain plate](022-top-down-terrain-plate.md) | world | active | [simulation](../../simulations/aaa-100/022-top-down-terrain-plate.md) | Terrain has one source of truth |
| 023 | [Height/mask data model](023-height-mask-data-model.md) | world | active | [simulation](../../simulations/aaa-100/023-height-mask-data-model.md) | Visual and gameplay use same data |
| 024 | [LOD ring contract](024-lod-ring-contract.md) | world/render | active | [simulation](../../simulations/aaa-100/024-lod-ring-contract.md) | No visible popping at normal speed |
| 025 | [Terrain mesh chunking](025-terrain-mesh-chunking.md) | render | planned | [simulation](../../simulations/aaa-100/025-terrain-mesh-chunking.md) | Mesh is continuous at seams |
| 026 | [Collider parity](026-collider-parity.md) | physics | active | [simulation](../../simulations/aaa-100/026-collider-parity.md) | Player never floats or sinks |
| 027 | [Biome/material masks](027-biome-material-masks.md) | art/world | planned | [simulation](../../simulations/aaa-100/027-biome-material-masks.md) | Terrain reads at a glance |
| 028 | [Landmark silhouette plan](028-landmark-silhouette-plan.md) | art/world | planned | [simulation](../../simulations/aaa-100/028-landmark-silhouette-plan.md) | Player can orient without UI |
| 029 | [Path and rail splines](029-path-rail-splines.md) | world | planned | [simulation](../../simulations/aaa-100/029-path-rail-splines.md) | Train and walking paths agree |
| 030 | [Gold-zone placement](030-gold-zone-placement.md) | gameplay/world | planned | [simulation](../../simulations/aaa-100/030-gold-zone-placement.md) | Gold location drives decisions |
| 031 | [Town/mine camp layout](031-town-mine-camp-layout.md) | world/art | planned | [simulation](../../simulations/aaa-100/031-town-mine-camp-layout.md) | Spaces support interaction |
| 032 | [Cover and ambush layout](032-cover-ambush-layout.md) | combat/world | planned | [simulation](../../simulations/aaa-100/032-cover-ambush-layout.md) | Combat has readable counterplay |
| 033 | [Extraction site layout](033-extraction-site-layout.md) | gameplay/world | planned | [simulation](../../simulations/aaa-100/033-extraction-site-layout.md) | Extraction is visible and risky |
| 034 | [Map streaming budget](034-map-streaming-budget.md) | performance | planned | [simulation](../../simulations/aaa-100/034-map-streaming-budget.md) | 60-player view remains stable |
| 035 | [Terrain proof suite](035-terrain-proof-suite.md) | validation | planned | [simulation](../../simulations/aaa-100/035-terrain-proof-suite.md) | Terrain work cannot regress silently |
| 036 | [Asset source catalog](036-asset-source-catalog.md) | content | planned | [simulation](../../simulations/aaa-100/036-asset-source-catalog.md) | Every asset has provenance |
| 037 | [Legacy approval decisions](037-legacy-approval-decisions.md) | content/legal | planned | [simulation](../../simulations/aaa-100/037-legacy-approval-decisions.md) | No raw/sanitized leak to runtime |
| 038 | [GLB conversion pipeline](038-glb-conversion-pipeline.md) | content | planned | [simulation](../../simulations/aaa-100/038-glb-conversion-pipeline.md) | Models enter as usable game assets |
| 039 | [Toon shader policy](039-toon-shader-policy.md) | art/render | planned | [simulation](../../simulations/aaa-100/039-toon-shader-policy.md) | Scene stops looking flat/primitive |
| 040 | [Prop protokit library](040-prop-protokit-library.md) | content | active | [simulation](../../simulations/aaa-100/040-prop-protokit-library.md) | Every object is kit-owned |
| 041 | [Rock/plant/clutter kits](041-rock-plant-clutter-kits.md) | content/world | planned | [simulation](../../simulations/aaa-100/041-rock-plant-clutter-kits.md) | Clutter supports scale, not noise |
| 042 | [Train asset kit](042-train-asset-kit.md) | content/scene | planned | [simulation](../../simulations/aaa-100/042-train-asset-kit.md) | Boarding sequence reads visually |
| 043 | [Audio cue promotion](043-audio-cue-promotion.md) | audio | planned | [simulation](../../simulations/aaa-100/043-audio-cue-promotion.md) | Procedural fallback is replaced safely |
| 044 | [Music state promotion](044-music-state-promotion.md) | audio | planned | [simulation](../../simulations/aaa-100/044-music-state-promotion.md) | Music changes by game state |
| 045 | [Asset performance budgets](045-asset-performance-budgets.md) | performance/content | planned | [simulation](../../simulations/aaa-100/045-asset-performance-budgets.md) | Imported assets do not tank browser |
| 046 | [Rig target](046-rig-target.md) | character | planned | [simulation](../../simulations/aaa-100/046-rig-target.md) | Character can support game actions |
| 047 | [Player mesh integration](047-player-mesh-integration.md) | character | planned | [simulation](../../simulations/aaa-100/047-player-mesh-integration.md) | Player no longer reads as placeholder |
| 048 | [Animation state graph](048-animation-state-graph.md) | animation | planned | [simulation](../../simulations/aaa-100/048-animation-state-graph.md) | Every loop action has animation state |
| 049 | [Locomotion blend](049-locomotion-blend.md) | animation/control | planned | [simulation](../../simulations/aaa-100/049-locomotion-blend.md) | Movement stops sliding visually |
| 050 | [Exploration camera complete](050-exploration-camera-complete.md) | control/camera | planned | [simulation](../../simulations/aaa-100/050-exploration-camera-complete.md) | Camera has single authority |
| 051 | [Combat camera complete](051-combat-camera-complete.md) | control/camera | planned | [simulation](../../simulations/aaa-100/051-combat-camera-complete.md) | Combat perspective is stateful |
| 052 | [Keyboard/mouse feel](052-keyboard-mouse-feel.md) | control | planned | [simulation](../../simulations/aaa-100/052-keyboard-mouse-feel.md) | Controls match player expectation |
| 053 | [Controller/accessibility input](053-controller-accessibility-input.md) | control/accessibility | planned | [simulation](../../simulations/aaa-100/053-controller-accessibility-input.md) | Core loop does not depend on one input style |
| 054 | [Lobby character preview](054-lobby-character-preview.md) | presentation | planned | [simulation](../../simulations/aaa-100/054-lobby-character-preview.md) | Lobby identity feels modern |
| 055 | [Bot/NPC prototypes](055-bot-npc-prototypes.md) | staging/combat | planned | [simulation](../../simulations/aaa-100/055-bot-npc-prototypes.md) | Single-player can simulate pressure |
| 056 | [Interaction hold system](056-interaction-hold-system.md) | gameplay | planned | [simulation](../../simulations/aaa-100/056-interaction-hold-system.md) | Mining/extraction feel consistent |
| 057 | [Mining object contracts](057-mining-object-contracts.md) | gameplay/content | planned | [simulation](../../simulations/aaa-100/057-mining-object-contracts.md) | Mining is object-driven |
| 058 | [Gold economy](058-gold-economy.md) | gameplay | planned | [simulation](../../simulations/aaa-100/058-gold-economy.md) | Gold creates extraction choices |
| 059 | [Cargo carry/drop](059-cargo-carry-drop.md) | gameplay/character | planned | [simulation](../../simulations/aaa-100/059-cargo-carry-drop.md) | Carrying changes play |
| 060 | [Deposit/cashout](060-deposit-cashout.md) | gameplay | planned | [simulation](../../simulations/aaa-100/060-deposit-cashout.md) | Extraction is not a button skip |
| 061 | [Extraction interruption](061-extraction-interruption.md) | gameplay/combat | planned | [simulation](../../simulations/aaa-100/061-extraction-interruption.md) | Cashout has stakes |
| 062 | [Claim ownership](062-claim-ownership.md) | gameplay/network | planned | [simulation](../../simulations/aaa-100/062-claim-ownership.md) | Receipts support multiplayer fairness |
| 063 | [Inventory items](063-inventory-items.md) | gameplay | planned | [simulation](../../simulations/aaa-100/063-inventory-items.md) | Loot has meaningful decisions |
| 064 | [Equipment/tools](064-equipment-tools.md) | gameplay/content | planned | [simulation](../../simulations/aaa-100/064-equipment-tools.md) | Tools are not hidden stats |
| 065 | [Train boarding sequence](065-train-boarding-sequence.md) | scene | planned | [simulation](../../simulations/aaa-100/065-train-boarding-sequence.md) | Intro sequence is reliable |
| 066 | [Onboarding/tutorial](066-onboarding-tutorial.md) | UX/staging | planned | [simulation](../../simulations/aaa-100/066-onboarding-tutorial.md) | First session is playable |
| 067 | [Reward/score receipts](067-reward-score-receipts.md) | match | planned | [simulation](../../simulations/aaa-100/067-reward-score-receipts.md) | Results are explainable |
| 068 | [Results/replay](068-results-replay.md) | match/presentation | planned | [simulation](../../simulations/aaa-100/068-results-replay.md) | Match ending has payoff |
| 069 | [Progression meta](069-progression-meta.md) | product | planned | [simulation](../../simulations/aaa-100/069-progression-meta.md) | Long-term play has goals |
| 070 | [Fail states/recovery](070-fail-states-recovery.md) | gameplay | planned | [simulation](../../simulations/aaa-100/070-fail-states-recovery.md) | Bad states resolve cleanly |
| 071 | [Combat mechanics](071-combat-mechanics.md) | combat | planned | [simulation](../../simulations/aaa-100/071-combat-mechanics.md) | Combat is playable, not just receipts |
| 072 | [Weapon kit](072-weapon-kit.md) | combat/content | planned | [simulation](../../simulations/aaa-100/072-weapon-kit.md) | Weapons have roles |
| 073 | [Health/downed/revive](073-health-downed-revive.md) | combat/team | planned | [simulation](../../simulations/aaa-100/073-health-downed-revive.md) | Squads have teamwork |
| 074 | [Cover system](074-cover-system.md) | combat/world | planned | [simulation](../../simulations/aaa-100/074-cover-system.md) | Terrain/object layout matters |
| 075 | [Threat AI/bots](075-threat-ai-bots.md) | staging/combat | planned | [simulation](../../simulations/aaa-100/075-threat-ai-bots.md) | Single-player staging has enemies |
| 076 | [Ambush events](076-ambush-events.md) | combat/gameplay | planned | [simulation](../../simulations/aaa-100/076-ambush-events.md) | Pressure is readable |
| 077 | [Final rush/zone pressure](077-final-rush-zone-pressure.md) | battle royale | planned | [simulation](../../simulations/aaa-100/077-final-rush-zone-pressure.md) | Match converges |
| 078 | [60-player partition contracts](078-60-player-partition-contracts.md) | network | planned | [simulation](../../simulations/aaa-100/078-60-player-partition-contracts.md) | 60-player scale is testable |
| 079 | [Party lobby and leader](079-party-lobby-leader.md) | network/UX | planned | [simulation](../../simulations/aaa-100/079-party-lobby-leader.md) | Squad start is reliable |
| 080 | [Replication snapshots](080-replication-snapshots.md) | network/runtime | planned | [simulation](../../simulations/aaa-100/080-replication-snapshots.md) | Network state is bounded |
| 081 | [Prediction/reconciliation](081-prediction-reconciliation.md) | network/control | planned | [simulation](../../simulations/aaa-100/081-prediction-reconciliation.md) | Movement does not jitter |
| 082 | [Disconnect/rejoin](082-disconnect-rejoin.md) | network | planned | [simulation](../../simulations/aaa-100/082-disconnect-rejoin.md) | Network failures are fair |
| 083 | [Sanity/anti-cheat boundaries](083-sanity-anti-cheat-boundaries.md) | network/security | planned | [simulation](../../simulations/aaa-100/083-sanity-anti-cheat-boundaries.md) | Public play is not trivial to spoof |
| 084 | [Bot fill/single-player staging](084-bot-fill-single-player-staging.md) | staging | planned | [simulation](../../simulations/aaa-100/084-bot-fill-single-player-staging.md) | One player can test full loop |
| 085 | [Matchmaker/private rooms](085-matchmaker-private-rooms.md) | network/product | planned | [simulation](../../simulations/aaa-100/085-matchmaker-private-rooms.md) | Testing and play sessions can start |
| 086 | [Staging environment](086-staging-environment.md) | staging | planned | [simulation](../../simulations/aaa-100/086-staging-environment.md) | Single-player staging is first-class |
| 087 | [Scenario runner](087-scenario-runner.md) | validation | planned | [simulation](../../simulations/aaa-100/087-scenario-runner.md) | Tests cover game paths |
| 088 | [NexusSimulator suite](088-nexussimulator-suite.md) | validation | planned | [simulation](../../simulations/aaa-100/088-nexussimulator-suite.md) | Simulation catches regressions |
| 089 | [Playwright human-view suite](089-playwright-human-view-suite.md) | validation | planned | [simulation](../../simulations/aaa-100/089-playwright-human-view-suite.md) | Player view remains primary |
| 090 | [Performance budgets](090-performance-budgets.md) | performance | planned | [simulation](../../simulations/aaa-100/090-performance-budgets.md) | AAA direction remains browser-feasible |
| 091 | [Memory/network budget](091-memory-network-budget.md) | performance/network | planned | [simulation](../../simulations/aaa-100/091-memory-network-budget.md) | 60-player mode has limits |
| 092 | [Deploy preview policy](092-deploy-preview-policy.md) | release | planned | [simulation](../../simulations/aaa-100/092-deploy-preview-policy.md) | Public link stays reliable |
| 093 | [Save/replay artifacts](093-save-replay-artifacts.md) | runtime | planned | [simulation](../../simulations/aaa-100/093-save-replay-artifacts.md) | Bugs can be replayed |
| 094 | [Error/crash telemetry](094-error-crash-telemetry.md) | runtime | planned | [simulation](../../simulations/aaa-100/094-error-crash-telemetry.md) | Failures are diagnosable |
| 095 | [QA release gates](095-qa-release-gates.md) | release | planned | [simulation](../../simulations/aaa-100/095-qa-release-gates.md) | No broad claim lacks proof |
| 096 | [Content polish pass](096-content-polish-pass.md) | art/design | planned | [simulation](../../simulations/aaa-100/096-content-polish-pass.md) | Prototype look is retired |
| 097 | [Accessibility pass](097-accessibility-pass.md) | UX | planned | [simulation](../../simulations/aaa-100/097-accessibility-pass.md) | More players can play |
| 098 | [Player feedback loop](098-player-feedback-loop.md) | production | planned | [simulation](../../simulations/aaa-100/098-player-feedback-loop.md) | Feedback becomes actionable |
| 099 | [Release packaging](099-release-packaging.md) | release | planned | [simulation](../../simulations/aaa-100/099-release-packaging.md) | Public presentation matches state |
| 100 | [Continuous audit loop](100-continuous-audit-loop.md) | production | planned | [simulation](../../simulations/aaa-100/100-continuous-audit-loop.md) | Project keeps improving after this plan |

# AAA 100 Data Matrix

Status: active

## Purpose

Track every roadmap step as planned, active, resolved, replaced, blocked, or fake-risk. This matrix is intentionally blunt: it prevents proof of a narrow slice from being mistaken for completion of the full AAA target.

| Step | Goal | Domain | State | Packet | Audit gate |
| --- | --- | --- | --- | --- | --- |
| 001 | Goal ledger freeze | governance | planned | 001-goal-ledger-freeze.md | Verify future passes do not redefine success |
| 002 | Current state baseline | governance | planned | 002-current-state-baseline.md | Compare every new pass against baseline |
| 003 | Branch/version model | governance | planned | 003-branch-version-model.md | Simulate bad deploy rollback |
| 004 | Restart packet policy | governance | planned | 004-restart-packet-policy.md | New agent can resume without chat memory |
| 005 | Kit ownership matrix | architecture | planned | 005-kit-ownership-matrix.md | No feature lacks an owning domain |
| 006 | Data matrix schema | architecture | planned | 006-data-matrix-schema.md | Matrix catches fake progress |
| 007 | ADR and decision log | architecture | planned | 007-adr-decision-log.md | Reversals are explicit |
| 008 | Public/private API rules | architecture | planned | 008-public-private-api-rules.md | Public API does not become config sprawl |
| 009 | Scope gates | production | planned | 009-scope-gates.md | Large changes pause at named gates |
| 010 | Proof contract | validation | planned | 010-proof-contract.md | Green proof states exactly what it covers |
| 011 | Game-engine feature scan | research | planned | 011-game-engine-feature-scan.md | Missing production surfaces are named |
| 012 | Battle royale scan | research | planned | 012-battle-royale-scan.md | GoldRush BR needs are explicit |
| 013 | Extraction scan | research | planned | 013-extraction-scan.md | Gold value creates risk decisions |
| 014 | Visual target packet | art direction | planned | 014-visual-target-packet.md | Prototype visuals cannot pass as final |
| 015 | Player persona matrix | product | planned | 015-player-persona-matrix.md | Every persona has a proof path |
| 016 | Minute interaction inventory | design | planned | 016-minute-interaction-inventory.md | No action remains vague |
| 017 | Proof taxonomy | validation | planned | 017-proof-taxonomy.md | Proof type matches feature risk |
| 018 | Risk register | production | planned | 018-risk-register.md | Highest risks have owners |
| 019 | Backlog slicing | production | planned | 019-backlog-slicing.md | Multiple agents do not overlap badly |
| 020 | Acceptance rubric | production | planned | 020-acceptance-rubric.md | Completion language is consistent |
| 021 | Terrain intention map | world | active | 021-terrain-intention-map.md | Map supports extraction and combat |
| 022 | Top-down terrain plate | world | active | 022-top-down-terrain-plate.md | Terrain has one source of truth |
| 023 | Height/mask data model | world | active | 023-height-mask-data-model.md | Visual and gameplay use same data |
| 024 | LOD ring contract | world/render | active | 024-lod-ring-contract.md | No visible popping at normal speed |
| 025 | Terrain mesh chunking | render | planned | 025-terrain-mesh-chunking.md | Mesh is continuous at seams |
| 026 | Collider parity | physics | active | 026-collider-parity.md | Player never floats or sinks |
| 027 | Biome/material masks | art/world | planned | 027-biome-material-masks.md | Terrain reads at a glance |
| 028 | Landmark silhouette plan | art/world | planned | 028-landmark-silhouette-plan.md | Player can orient without UI |
| 029 | Path and rail splines | world | planned | 029-path-rail-splines.md | Train and walking paths agree |
| 030 | Gold-zone placement | gameplay/world | planned | 030-gold-zone-placement.md | Gold location drives decisions |
| 031 | Town/mine camp layout | world/art | planned | 031-town-mine-camp-layout.md | Spaces support interaction |
| 032 | Cover and ambush layout | combat/world | planned | 032-cover-ambush-layout.md | Combat has readable counterplay |
| 033 | Extraction site layout | gameplay/world | planned | 033-extraction-site-layout.md | Extraction is visible and risky |
| 034 | Map streaming budget | performance | planned | 034-map-streaming-budget.md | 60-player view remains stable |
| 035 | Terrain proof suite | validation | planned | 035-terrain-proof-suite.md | Terrain work cannot regress silently |
| 036 | Asset source catalog | content | planned | 036-asset-source-catalog.md | Every asset has provenance |
| 037 | Legacy approval decisions | content/legal | planned | 037-legacy-approval-decisions.md | No raw/sanitized leak to runtime |
| 038 | GLB conversion pipeline | content | planned | 038-glb-conversion-pipeline.md | Models enter as usable game assets |
| 039 | Toon shader policy | art/render | planned | 039-toon-shader-policy.md | Scene stops looking flat/primitive |
| 040 | Prop protokit library | content | active | 040-prop-protokit-library.md | Every object is kit-owned |
| 041 | Rock/plant/clutter kits | content/world | planned | 041-rock-plant-clutter-kits.md | Clutter supports scale, not noise |
| 042 | Train asset kit | content/scene | planned | 042-train-asset-kit.md | Boarding sequence reads visually |
| 043 | Audio cue promotion | audio | planned | 043-audio-cue-promotion.md | Procedural fallback is replaced safely |
| 044 | Music state promotion | audio | planned | 044-music-state-promotion.md | Music changes by game state |
| 045 | Asset performance budgets | performance/content | planned | 045-asset-performance-budgets.md | Imported assets do not tank browser |
| 046 | Rig target | character | planned | 046-rig-target.md | Character can support game actions |
| 047 | Player mesh integration | character | planned | 047-player-mesh-integration.md | Player no longer reads as placeholder |
| 048 | Animation state graph | animation | planned | 048-animation-state-graph.md | Every loop action has animation state |
| 049 | Locomotion blend | animation/control | planned | 049-locomotion-blend.md | Movement stops sliding visually |
| 050 | Exploration camera complete | control/camera | planned | 050-exploration-camera-complete.md | Camera has single authority |
| 051 | Combat camera complete | control/camera | planned | 051-combat-camera-complete.md | Combat perspective is stateful |
| 052 | Keyboard/mouse feel | control | planned | 052-keyboard-mouse-feel.md | Controls match player expectation |
| 053 | Controller/accessibility input | control/accessibility | planned | 053-controller-accessibility-input.md | Core loop does not depend on one input style |
| 054 | Lobby character preview | presentation | planned | 054-lobby-character-preview.md | Lobby identity feels modern |
| 055 | Bot/NPC prototypes | staging/combat | planned | 055-bot-npc-prototypes.md | Single-player can simulate pressure |
| 056 | Interaction hold system | gameplay | planned | 056-interaction-hold-system.md | Mining/extraction feel consistent |
| 057 | Mining object contracts | gameplay/content | planned | 057-mining-object-contracts.md | Mining is object-driven |
| 058 | Gold economy | gameplay | planned | 058-gold-economy.md | Gold creates extraction choices |
| 059 | Cargo carry/drop | gameplay/character | planned | 059-cargo-carry-drop.md | Carrying changes play |
| 060 | Deposit/cashout | gameplay | planned | 060-deposit-cashout.md | Extraction is not a button skip |
| 061 | Extraction interruption | gameplay/combat | planned | 061-extraction-interruption.md | Cashout has stakes |
| 062 | Claim ownership | gameplay/network | planned | 062-claim-ownership.md | Receipts support multiplayer fairness |
| 063 | Inventory items | gameplay | planned | 063-inventory-items.md | Loot has meaningful decisions |
| 064 | Equipment/tools | gameplay/content | planned | 064-equipment-tools.md | Tools are not hidden stats |
| 065 | Train boarding sequence | scene | planned | 065-train-boarding-sequence.md | Intro sequence is reliable |
| 066 | Onboarding/tutorial | UX/staging | planned | 066-onboarding-tutorial.md | First session is playable |
| 067 | Reward/score receipts | match | planned | 067-reward-score-receipts.md | Results are explainable |
| 068 | Results/replay | match/presentation | planned | 068-results-replay.md | Match ending has payoff |
| 069 | Progression meta | product | planned | 069-progression-meta.md | Long-term play has goals |
| 070 | Fail states/recovery | gameplay | planned | 070-fail-states-recovery.md | Bad states resolve cleanly |
| 071 | Combat mechanics | combat | planned | 071-combat-mechanics.md | Combat is playable, not just receipts |
| 072 | Weapon kit | combat/content | planned | 072-weapon-kit.md | Weapons have roles |
| 073 | Health/downed/revive | combat/team | planned | 073-health-downed-revive.md | Squads have teamwork |
| 074 | Cover system | combat/world | planned | 074-cover-system.md | Terrain/object layout matters |
| 075 | Threat AI/bots | staging/combat | planned | 075-threat-ai-bots.md | Single-player staging has enemies |
| 076 | Ambush events | combat/gameplay | planned | 076-ambush-events.md | Pressure is readable |
| 077 | Final rush/zone pressure | battle royale | planned | 077-final-rush-zone-pressure.md | Match converges |
| 078 | 60-player partition contracts | network | planned | 078-60-player-partition-contracts.md | 60-player scale is testable |
| 079 | Party lobby and leader | network/UX | planned | 079-party-lobby-leader.md | Squad start is reliable |
| 080 | Replication snapshots | network/runtime | planned | 080-replication-snapshots.md | Network state is bounded |
| 081 | Prediction/reconciliation | network/control | planned | 081-prediction-reconciliation.md | Movement does not jitter |
| 082 | Disconnect/rejoin | network | planned | 082-disconnect-rejoin.md | Network failures are fair |
| 083 | Sanity/anti-cheat boundaries | network/security | planned | 083-sanity-anti-cheat-boundaries.md | Public play is not trivial to spoof |
| 084 | Bot fill/single-player staging | staging | planned | 084-bot-fill-single-player-staging.md | One player can test full loop |
| 085 | Matchmaker/private rooms | network/product | planned | 085-matchmaker-private-rooms.md | Testing and play sessions can start |
| 086 | Staging environment | staging | planned | 086-staging-environment.md | Single-player staging is first-class |
| 087 | Scenario runner | validation | planned | 087-scenario-runner.md | Tests cover game paths |
| 088 | NexusSimulator suite | validation | planned | 088-nexussimulator-suite.md | Simulation catches regressions |
| 089 | Playwright human-view suite | validation | planned | 089-playwright-human-view-suite.md | Player view remains primary |
| 090 | Performance budgets | performance | planned | 090-performance-budgets.md | AAA direction remains browser-feasible |
| 091 | Memory/network budget | performance/network | planned | 091-memory-network-budget.md | 60-player mode has limits |
| 092 | Deploy preview policy | release | planned | 092-deploy-preview-policy.md | Public link stays reliable |
| 093 | Save/replay artifacts | runtime | planned | 093-save-replay-artifacts.md | Bugs can be replayed |
| 094 | Error/crash telemetry | runtime | planned | 094-error-crash-telemetry.md | Failures are diagnosable |
| 095 | QA release gates | release | planned | 095-qa-release-gates.md | No broad claim lacks proof |
| 096 | Content polish pass | art/design | planned | 096-content-polish-pass.md | Prototype look is retired |
| 097 | Accessibility pass | UX | planned | 097-accessibility-pass.md | More players can play |
| 098 | Player feedback loop | production | planned | 098-player-feedback-loop.md | Feedback becomes actionable |
| 099 | Release packaging | release | planned | 099-release-packaging.md | Public presentation matches state |
| 100 | Continuous audit loop | production | planned | 100-continuous-audit-loop.md | Project keeps improving after this plan |

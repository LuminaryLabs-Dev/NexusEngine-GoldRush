# GoldRush AAA Production Roadmap

Status: active docs-only plan

## Purpose

This roadmap turns the current `NexusEngine-GoldRush` prototype into a long-term production plan for a high-fidelity, toon-shaded, wild-west extraction battle royale.

The immediate conclusion is that the project is plateauing because the current procedural scene proves systems, but it does not yet have an authored terrain source, asset-kit library, or production art pipeline strong enough to carry a 60-player extraction game.

## Current Evidence

| Surface | Current proof | What it proves | What it does not prove |
| --- | --- | --- | --- |
| Reality status | `node tools/validation/validate-reality-status.mjs` | 14 domains, 7 real local systems, 5 prototype systems, 2 cloud-blocked systems | No promoted assets, audio, or animations |
| Kit contracts | `node tools/validation/validate-domain-kit-contracts.mjs` | 31 generic incubator kits, 39 GoldRush kits, 31 pairings | AAA content quality |
| Terrain | `node tools/validation/validate-terrain-collider.mjs` | Shared terrain collider and grounding contract passes | Large authored map readability |
| Physics | `node tools/validation/validate-physics-backend-kit.mjs` | `cannon-es` is active and Rapier is a future adapter | Full character/controller physics |
| Player loop | `node tools/validation/validate-player-loop-readiness.mjs` | Mine, carry, cashout, and result readiness are represented | High-fidelity interaction feel |
| Combat loop | `node tools/validation/validate-combat-loop-readiness.mjs` | Combat readiness matrix is represented | Full battle royale combat depth |
| Procedural objects | `node tools/validation/validate-procedural-renderer-kits.mjs` | Procedural object kits validate | Authored AAA prop geometry |
| Free candidates | `node tools/validation/validate-free-toon-candidates.mjs` | 16 model candidates and 6 audio candidates exist | Runtime approval or production use |

## External Reference Notes

- [GitHub Game Engines collection](https://github.com/collections/game-engines): use as a checklist for missing production surfaces such as scene management, asset loading, physics, rendering, tooling, validation, and platform deployment. Do not turn GoldRush into a general engine.
- [PUBG overview](https://pubg.com/en/game-info/overview): battle royale needs land/loot/survive pressure, large map travel, vehicles or equivalent traversal, shrinking danger, training/staging, and solo/duo/squad modes.
- [Apex Legends Knockout event](https://www.ea.com/games/apex-legends/apex-legends/news/space-hunt-event): a 60-player, 20-squad format can use objective scoring, round pressure, squad readability, and a high-stakes finale.
- [Fortnite store page](https://store.epicgames.com/p/fortnite?lang=en-US): mode variety, squad play, movement literacy, no-build spatial skill, tighter 40-player mode framing, and player-facing lobby identity matter.
- [Hunt Showdown bounty extract event](https://www.huntshowdown.com/news/clear-skies-bounty-extracts): extraction should make carried value, map risk, visibility, and reward progression legible.

## Target Shape

```txt
GoldRush AAA kit stack
|-- governance and versioning
|-- restart-with-new-knowledge packets
|-- staging and single-player simulation
|-- domain service kit contracts
|-- authored terrain source
|-- terrain mesh and LOD runtime
|-- terrain collider and physics parity
|-- asset/audio approval and promotion
|-- object protokit library
|-- character, camera, and control
|-- mining, cargo, extraction, and economy
|-- combat, pressure, and 60-player orchestration
|-- UI, HUD, results, replay, and accessibility
`-- local/public proof, deployment, and continuous audit
```

## Plateau Diagnosis

- The current scene is a strong systems prototype, but it is still mostly generated from procedural descriptors.
- The map has no single authored source of truth for macro layout, sightlines, traversal lanes, gold zones, towns, extraction sites, and combat cover.
- Individual props exist as micro-kits, but many are still primitive-like visual forms rather than production assets.
- The terrain collider is real, but the terrain art and player-readable geography are not yet production-authored.
- The player loop is represented, but the sensory layer still lacks high-fidelity animation, audio, props, and interaction feedback.
- The 60-player target needs simulation/staging first, then real network proof after the single-player path is stable.

## Map Production Direction

The next major production layer should be a drawn terrain kit:

```txt
n:goldrush:authored-desert-map
|-- source drawing
|   |-- height plate
|   |-- biome/color mask
|   |-- trail/rail mask
|   |-- gold-zone mask
|   |-- town/mine/camp masks
|   |-- extraction masks
|   `-- cover/sightline masks
|-- generated runtime terrain
|   |-- continuous triangle mesh
|   |-- chunked LOD rings
|   |-- collider heightfield
|   |-- slope/walkability map
|   `-- raycast placement surface
`-- kit consumers
    |-- object protokits
    |-- route guidance
    |-- combat cover
    |-- extraction set pieces
    |-- train/rail sequence
    `-- staging bots
```

## 100-Step Plan

Each step has a research packet path. The initial packet can be a summary `.md`; if the step grows, split it into child files under the same folder.

| Step | Domain | Atomic implementation substeps | Research packet | Audit/simulation gate |
| --- | --- | --- | --- | --- |
| 001 Goal ledger freeze | governance | Record final AAA target; list non-completion truth; define docs/code boundary | `.agent/research/aaa-100/001-goal-ledger-freeze.md` | Verify future passes do not redefine success |
| 002 Current state baseline | governance | Run readiness validators; record pass/fail; capture dirty-worktree risks | `.agent/research/aaa-100/002-current-state-baseline.md` | Compare every new pass against baseline |
| 003 Branch/version model | governance | Document `development`, `Build`, import branches; define release labels; define rollback points | `.agent/research/aaa-100/003-branch-version-model.md` | Simulate bad deploy rollback |
| 004 Restart packet policy | governance | Create restart template; capture learned facts; link proof artifacts | `.agent/research/aaa-100/004-restart-packet-policy.md` | New agent can resume without chat memory |
| 005 Kit ownership matrix | architecture | Map every current kit; assign domain owner; flag overloaded kits | `.agent/research/aaa-100/005-kit-ownership-matrix.md` | No feature lacks an owning domain |
| 006 Data matrix schema | architecture | Define resolved/open/fake columns; add proof column; add lesson column | `.agent/research/aaa-100/006-data-matrix-schema.md` | Matrix catches fake progress |
| 007 ADR and decision log | architecture | Add decision template; record physics choice; record asset boundary | `.agent/research/aaa-100/007-adr-decision-log.md` | Reversals are explicit |
| 008 Public/private API rules | architecture | Minimize public APIs; list internal API roles; validate snapshots | `.agent/research/aaa-100/008-public-private-api-rules.md` | Public API does not become config sprawl |
| 009 Scope gates | production | Define feature gate; define visual gate; define deploy gate | `.agent/research/aaa-100/009-scope-gates.md` | Large changes pause at named gates |
| 010 Proof contract | validation | Define CLI proof; define Playwright proof; define human-view proof | `.agent/research/aaa-100/010-proof-contract.md` | Green proof states exactly what it covers |
| 011 Game-engine feature scan | research | Extract scene/loading/render/physics/tooling ideas; reject engine-scope extras | `.agent/research/aaa-100/011-game-engine-feature-scan.md` | Missing production surfaces are named |
| 012 Battle royale scan | research | Compare PUBG, Apex, Fortnite; extract scale/traversal/mode needs | `.agent/research/aaa-100/012-battle-royale-scan.md` | GoldRush BR needs are explicit |
| 013 Extraction scan | research | Compare extraction reward loops; define bounty/gold pressure | `.agent/research/aaa-100/013-extraction-scan.md` | Gold value creates risk decisions |
| 014 Visual target packet | art direction | Define toon-shaded western look; set reference rules; set rejection criteria | `.agent/research/aaa-100/014-visual-target-packet.md` | Prototype visuals cannot pass as final |
| 015 Player persona matrix | product | Define solo tester; squad leader; combat player; extractor; spectator | `.agent/research/aaa-100/015-player-persona-matrix.md` | Every persona has a proof path |
| 016 Minute interaction inventory | design | List press/hold/look/move/board/mine/carry/shoot/extract/results moments | `.agent/research/aaa-100/016-minute-interaction-inventory.md` | No action remains vague |
| 017 Proof taxonomy | validation | Split local, public, simulator, video, screenshot, unit-style validators | `.agent/research/aaa-100/017-proof-taxonomy.md` | Proof type matches feature risk |
| 018 Risk register | production | Rank asset, network, performance, UX, deploy, licensing risks | `.agent/research/aaa-100/018-risk-register.md` | Highest risks have owners |
| 019 Backlog slicing | production | Convert 100 steps to batches; identify parallel-safe docs; identify code locks | `.agent/research/aaa-100/019-backlog-slicing.md` | Multiple agents do not overlap badly |
| 020 Acceptance rubric | production | Define prototype, playable, shippable, AAA-ready levels | `.agent/research/aaa-100/020-acceptance-rubric.md` | Completion language is consistent |
| 021 Terrain intention map | world | Draw gameplay zones; name landmarks; assign routes | `.agent/research/aaa-100/021-terrain-intention-map.md` | Map supports extraction and combat |
| 022 Top-down terrain plate | world | Create source plate spec; define coordinate scale; set origin and bounds | `.agent/research/aaa-100/022-top-down-terrain-plate.md` | Terrain has one source of truth |
| 023 Height/mask data model | world | Define height channels; define biome masks; define gameplay masks | `.agent/research/aaa-100/023-height-mask-data-model.md` | Visual and gameplay use same data |
| 024 LOD ring contract | world/render | Define near/mid/far rings; set chunk sizes; set swap thresholds | `.agent/research/aaa-100/024-lod-ring-contract.md` | No visible popping at normal speed |
| 025 Terrain mesh chunking | render | Generate chunks; share vertices or skirts; expose chunk metadata | `.agent/research/aaa-100/025-terrain-mesh-chunking.md` | Mesh is continuous at seams |
| 026 Collider parity | physics | Build collider from height source; sample raycasts; compare visible ground | `.agent/research/aaa-100/026-collider-parity.md` | Player never floats or sinks |
| 027 Biome/material masks | art/world | Map sand, clay, rock, trail, gold, town, rail surfaces | `.agent/research/aaa-100/027-biome-material-masks.md` | Terrain reads at a glance |
| 028 Landmark silhouette plan | art/world | Place central mountain; ridge walls; mine shelf; town shelf | `.agent/research/aaa-100/028-landmark-silhouette-plan.md` | Player can orient without UI |
| 029 Path and rail splines | world | Author rail path; author trails; mark train stops and crossings | `.agent/research/aaa-100/029-path-rail-splines.md` | Train and walking paths agree |
| 030 Gold-zone placement | gameplay/world | Define seam zones; define yields; define contest risk | `.agent/research/aaa-100/030-gold-zone-placement.md` | Gold location drives decisions |
| 031 Town/mine camp layout | world/art | Place town streets; mine entrance; camp set pieces; cover | `.agent/research/aaa-100/031-town-mine-camp-layout.md` | Spaces support interaction |
| 032 Cover and ambush layout | combat/world | Place cover arcs; sightlines; flank paths; retreat paths | `.agent/research/aaa-100/032-cover-ambush-layout.md` | Combat has readable counterplay |
| 033 Extraction site layout | gameplay/world | Place rail depot; alternate cashouts; contest radii; visual beacons | `.agent/research/aaa-100/033-extraction-site-layout.md` | Extraction is visible and risky |
| 034 Map streaming budget | performance | Define active chunks; define object budgets; define memory targets | `.agent/research/aaa-100/034-map-streaming-budget.md` | 60-player view remains stable |
| 035 Terrain proof suite | validation | Add spawn screenshots; movement samples; seam checks; slope checks | `.agent/research/aaa-100/035-terrain-proof-suite.md` | Terrain work cannot regress silently |
| 036 Asset source catalog | content | List legacy, free, procedural, generated asset sources | `.agent/research/aaa-100/036-asset-source-catalog.md` | Every asset has provenance |
| 037 Legacy approval decisions | content/legal | Route human review; record license status; block runtime promotion until approved | `.agent/research/aaa-100/037-legacy-approval-decisions.md` | No raw/sanitized leak to runtime |
| 038 GLB conversion pipeline | content | Define FBX-to-GLB requests; validate scale; validate pivots | `.agent/research/aaa-100/038-glb-conversion-pipeline.md` | Models enter as usable game assets |
| 039 Toon shader policy | art/render | Define ramps; outline rules; material roles; lighting constraints | `.agent/research/aaa-100/039-toon-shader-policy.md` | Scene stops looking flat/primitive |
| 040 Prop protokit library | content | Create prop taxonomy; assign IDs; define placement and affordance | `.agent/research/aaa-100/040-prop-protokit-library.md` | Every object is kit-owned |
| 041 Rock/plant/clutter kits | content/world | Split rocks, cactus, scrub, gravel, debris; raycast placement | `.agent/research/aaa-100/041-rock-plant-clutter-kits.md` | Clutter supports scale, not noise |
| 042 Train asset kit | content/scene | Define train mesh slots; door; seats; bell; wheels; path anchor | `.agent/research/aaa-100/042-train-asset-kit.md` | Boarding sequence reads visually |
| 043 Audio cue promotion | audio | Map title, train, mining, revolver, cashout, result cues | `.agent/research/aaa-100/043-audio-cue-promotion.md` | Procedural fallback is replaced safely |
| 044 Music state promotion | audio | Map menu, roam, combat, final rush, results loops | `.agent/research/aaa-100/044-music-state-promotion.md` | Music changes by game state |
| 045 Asset performance budgets | performance/content | Set triangle, draw-call, texture, audio, animation limits | `.agent/research/aaa-100/045-asset-performance-budgets.md` | Imported assets do not tank browser |
| 046 Rig target | character | Define skeleton needs; knees; hands; weapon; cargo attach points | `.agent/research/aaa-100/046-rig-target.md` | Character can support game actions |
| 047 Player mesh integration | character | Select approved mesh; scale; pivot; shadow; material | `.agent/research/aaa-100/047-player-mesh-integration.md` | Player no longer reads as placeholder |
| 048 Animation state graph | animation | Define idle, walk, run, mine, carry, aim, shoot, hit, extract | `.agent/research/aaa-100/048-animation-state-graph.md` | Every loop action has animation state |
| 049 Locomotion blend | animation/control | Blend speed; slope; cargo weight; strafing; stop/start | `.agent/research/aaa-100/049-locomotion-blend.md` | Movement stops sliding visually |
| 050 Exploration camera complete | control/camera | Mouse look; shoulder offset; collision; smoothing; no pulsing | `.agent/research/aaa-100/050-exploration-camera-complete.md` | Camera has single authority |
| 051 Combat camera complete | control/camera | Aim mode; cover peek; threat framing; recoil; return to explore | `.agent/research/aaa-100/051-combat-camera-complete.md` | Combat perspective is stateful |
| 052 Keyboard/mouse feel | control | WASD relative to camera; sprint; interact; cancel; aim/fire | `.agent/research/aaa-100/052-keyboard-mouse-feel.md` | Controls match player expectation |
| 053 Controller/accessibility input | control/accessibility | Map sticks; dead zones; remap; hold alternatives | `.agent/research/aaa-100/053-controller-accessibility-input.md` | Core loop does not depend on one input style |
| 054 Lobby character preview | presentation | 3D preview; drag spin; outfit/cargo preview; party slots | `.agent/research/aaa-100/054-lobby-character-preview.md` | Lobby identity feels modern |
| 055 Bot/NPC prototypes | staging/combat | Add staging bots; path targets; threat signals; fake party members | `.agent/research/aaa-100/055-bot-npc-prototypes.md` | Single-player can simulate pressure |
| 056 Interaction hold system | gameplay | Normalize hold start/update/cancel/complete; expose progress | `.agent/research/aaa-100/056-interaction-hold-system.md` | Mining/extraction feel consistent |
| 057 Mining object contracts | gameplay/content | Define mineable object kit; yield; depletion; visuals; audio | `.agent/research/aaa-100/057-mining-object-contracts.md` | Mining is object-driven |
| 058 Gold economy | gameplay | Define gold value; carry cap; scarcity; team sharing; loss | `.agent/research/aaa-100/058-gold-economy.md` | Gold creates extraction choices |
| 059 Cargo carry/drop | gameplay/character | Attach visual cargo; weight movement; drop on damage; pickup | `.agent/research/aaa-100/059-cargo-carry-drop.md` | Carrying changes play |
| 060 Deposit/cashout | gameplay | Define cashout hold; contest state; receipt; score transfer | `.agent/research/aaa-100/060-deposit-cashout.md` | Extraction is not a button skip |
| 061 Extraction interruption | gameplay/combat | Define damage cancel; enemy contest; timeout; partial deposit | `.agent/research/aaa-100/061-extraction-interruption.md` | Cashout has stakes |
| 062 Claim ownership | gameplay/network | Track who mined; who carried; team ownership; theft | `.agent/research/aaa-100/062-claim-ownership.md` | Receipts support multiplayer fairness |
| 063 Inventory items | gameplay | Define tools, ammo, tonics, dynamite, map clues | `.agent/research/aaa-100/063-inventory-items.md` | Loot has meaningful decisions |
| 064 Equipment/tools | gameplay/content | Pickaxe, pan, revolver, rifle, lantern, satchel; kit contracts | `.agent/research/aaa-100/064-equipment-tools.md` | Tools are not hidden stats |
| 065 Train boarding sequence | scene | Train approaches; door opens; player boards; lock; depart; handoff | `.agent/research/aaa-100/065-train-boarding-sequence.md` | Intro sequence is reliable |
| 066 Onboarding/tutorial | UX/staging | Teach move/look; mine; carry; threat; extract; results | `.agent/research/aaa-100/066-onboarding-tutorial.md` | First session is playable |
| 067 Reward/score receipts | match | Normalize mined, stolen, dropped, extracted, combat receipts | `.agent/research/aaa-100/067-reward-score-receipts.md` | Results are explainable |
| 068 Results/replay | match/presentation | Show placement; gold; pressure; moments; replay digest | `.agent/research/aaa-100/068-results-replay.md` | Match ending has payoff |
| 069 Progression meta | product | Define unlocks; cosmetics; stats; non-pay-to-win boundaries | `.agent/research/aaa-100/069-progression-meta.md` | Long-term play has goals |
| 070 Fail states/recovery | gameplay | Handle death, drop, disconnect, timeout, stuck, no gold | `.agent/research/aaa-100/070-fail-states-recovery.md` | Bad states resolve cleanly |
| 071 Combat mechanics | combat | Define weapon handling; hit rules; cover; damage; downing | `.agent/research/aaa-100/071-combat-mechanics.md` | Combat is playable, not just receipts |
| 072 Weapon kit | combat/content | Revolver; rifle; shotgun; pickaxe melee; projectiles/hitscan choice | `.agent/research/aaa-100/072-weapon-kit.md` | Weapons have roles |
| 073 Health/downed/revive | combat/team | Health; armor?; bleedout; revive; carry gold loss | `.agent/research/aaa-100/073-health-downed-revive.md` | Squads have teamwork |
| 074 Cover system | combat/world | Cover affordance; peek; vault; protection value; destructibility later | `.agent/research/aaa-100/074-cover-system.md` | Terrain/object layout matters |
| 075 Threat AI/bots | staging/combat | Bot perception; patrol; chase; shoot; retreat; cashout contest | `.agent/research/aaa-100/075-threat-ai-bots.md` | Single-player staging has enemies |
| 076 Ambush events | combat/gameplay | Trigger by cargo/noise; telegraph; spawn rules; receipt | `.agent/research/aaa-100/076-ambush-events.md` | Pressure is readable |
| 077 Final rush/zone pressure | battle royale | Shrink/collapse rule; safe zones; extraction lockouts; finale | `.agent/research/aaa-100/077-final-rush-zone-pressure.md` | Match converges |
| 078 60-player partition contracts | network | Define 60 target; party squads; room partitions; snapshots | `.agent/research/aaa-100/078-60-player-partition-contracts.md` | 60-player scale is testable |
| 079 Party lobby and leader | network/UX | 4-player lobby; code join; leader launch; ready states | `.agent/research/aaa-100/079-party-lobby-leader.md` | Squad start is reliable |
| 080 Replication snapshots | network/runtime | Position; actions; receipts; zone; inventory; compact deltas | `.agent/research/aaa-100/080-replication-snapshots.md` | Network state is bounded |
| 081 Prediction/reconciliation | network/control | Local input buffer; server/authority snapshot; correction smoothing | `.agent/research/aaa-100/081-prediction-reconciliation.md` | Movement does not jitter |
| 082 Disconnect/rejoin | network | Drop policy; reconnect token; carried gold policy; receipts | `.agent/research/aaa-100/082-disconnect-rejoin.md` | Network failures are fair |
| 083 Sanity/anti-cheat boundaries | network/security | Validate impossible moves; impossible gold; rate limits; receipt auth | `.agent/research/aaa-100/083-sanity-anti-cheat-boundaries.md` | Public play is not trivial to spoof |
| 084 Bot fill/single-player staging | staging | Fill empty squads; simulate 60; scenario controls; debug seeding | `.agent/research/aaa-100/084-bot-fill-single-player-staging.md` | One player can test full loop |
| 085 Matchmaker/private rooms | network/product | Private code; mode select; 20/40/60 presets; public later | `.agent/research/aaa-100/085-matchmaker-private-rooms.md` | Testing and play sessions can start |
| 086 Staging environment | staging | Add scenario site; dev controls; seed selector; state panel hidden by foldout | `.agent/research/aaa-100/086-staging-environment.md` | Single-player staging is first-class |
| 087 Scenario runner | validation | Define route scenarios; combat scenarios; extraction scenarios | `.agent/research/aaa-100/087-scenario-runner.md` | Tests cover game paths |
| 088 NexusSimulator suite | validation | Expand sim scenarios; local reports; sanitized outputs; loop mode | `.agent/research/aaa-100/088-nexussimulator-suite.md` | Simulation catches regressions |
| 089 Playwright human-view suite | validation | Screenshot title/lobby/train/run/combat/extract/results; video motion only | `.agent/research/aaa-100/089-playwright-human-view-suite.md` | Player view remains primary |
| 090 Performance budgets | performance | Frame time; draw calls; heap; network bytes; load time | `.agent/research/aaa-100/090-performance-budgets.md` | AAA direction remains browser-feasible |
| 091 Memory/network budget | performance/network | Track snapshots; asset cache; LOD memory; peer messages | `.agent/research/aaa-100/091-memory-network-budget.md` | 60-player mode has limits |
| 092 Deploy preview policy | release | Build branch; preview proof; public smoke; rollback proof | `.agent/research/aaa-100/092-deploy-preview-policy.md` | Public link stays reliable |
| 093 Save/replay artifacts | runtime | Store receipts; replay summaries; deterministic seeds; sanitized reports | `.agent/research/aaa-100/093-save-replay-artifacts.md` | Bugs can be replayed |
| 094 Error/crash telemetry | runtime | Capture console errors; unhandled promises; proof failure packets | `.agent/research/aaa-100/094-error-crash-telemetry.md` | Failures are diagnosable |
| 095 QA release gates | release | Define local gate; public gate; asset gate; network gate | `.agent/research/aaa-100/095-qa-release-gates.md` | No broad claim lacks proof |
| 096 Content polish pass | art/design | Replace weak props; improve lighting; sound; motion; composition | `.agent/research/aaa-100/096-content-polish-pass.md` | Prototype look is retired |
| 097 Accessibility pass | UX | Color-safe cues; subtitles; remap; motion comfort; readable prompts | `.agent/research/aaa-100/097-accessibility-pass.md` | More players can play |
| 098 Player feedback loop | production | Record playtest notes; one-change loop; classify feedback by domain | `.agent/research/aaa-100/098-player-feedback-loop.md` | Feedback becomes actionable |
| 099 Release packaging | release | README; controls; public docs; trailer captures; issue templates | `.agent/research/aaa-100/099-release-packaging.md` | Public presentation matches state |
| 100 Continuous audit loop | production | Run repeated audits; split new packets; mark resolved; restart with lessons | `.agent/research/aaa-100/100-continuous-audit-loop.md` | Project keeps improving after this plan |

## Expansion Rule

Each step can expand into thousands of `.md` files by applying this deterministic split:

```txt
.agent/research/aaa-100/<step-id>-<slug>.md
`-- child-packets/
    |-- 001-intent.md
    |-- 002-current-evidence.md
    |-- 003-reference-research.md
    |-- 004-data-contract.md
    |-- 005-player-view.md
    |-- 006-edge-cases.md
    |-- 007-validation.md
    `-- 008-deploy-risk.md
```

## Immediate Production Move

The most useful next code phase is not more random scenery. It is:

1. Author a terrain source packet for the whole desert map.
2. Build `n:goldrush:authored-desert-map` as the map source of truth.
3. Generate terrain mesh, LOD chunks, collider, and placement raycast data from that one source.
4. Convert current object micro-kits into consumers of placement masks instead of mostly free scatter.
5. Promote selected toon assets into object protokits only after approval/provenance gates.

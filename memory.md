# Repo Memory

## Purpose

`NexusEngine-GoldRush` is the destination repo for the modern Gold Rush rebuild. It should become a static-browser-deployable game backed by NexusRealtime-style kit composition and room orchestration.

## Architecture Decisions

- Keep this repo as the only local checkout for the Gold Rush rebuild workflow.
- Treat legacy repositories as cloud-side source inputs only.
- Raw legacy data must land in `raw/imported/<jobId>/`.
- Sanitation and conversion outputs must land in `sanitized/`.
- Runtime app assets must land in `public/assets/`.
- Game code should compose domain kits instead of hiding reusable behavior in renderer code.
- GoldRush uses a two-layer Domain Service Kit system: neutral generic incubator kits under `src/kits/generic-incubator/` install first with `n:*:*` domainPath metadata, then GoldRush custom kits connect them into game-specific rules.
- Generic incubator kits are local promotion candidates only. They must not contain GoldRush naming, GoldRush rules, or asset-specific assumptions, and `tools/validation/validate-domain-kit-contracts.mjs` enforces that boundary.
- `engine.n.goldrushKitContracts` exposes the full generic-to-GoldRush pairing registry, the 10-field kit contract template, and runtime install graph proof.
- `engine.n.goldrushNetwork` is the public multiplayer contract. The old shard structure is now an internal 50-player partition policy behind that kit.
- Player joining UI is scoped to a small PeerJS party-code lobby: four players join by code, then the party leader launches the larger simulated match.
- Renderers own presentation only.
- Local Codex work may add or modify kits only inside `NexusEngine-GoldRush`; other kit repos are cloud/GPT-it inspection sources, not local edit targets.
- The visible Gold Rush terrain should be a massive procedural field made from many small tessellated patches, not a circular arena primitive.
- Towns, mountains, paths, gold zones, loading gates, and room patch windows are first-class world descriptors owned by `engine.n.goldrushWorld`.
- Terrain windows, town layouts, path networks, gold zones, loading gates, camera descriptors, audio state, and animation state should be exposed as dedicated NexusRealtime APIs rather than only nested world data.
- Browser validation can inspect `window.GoldRushHost.getState()` for scenario, world, terrain, town, path, gold-zone, loading-gate, audio, animation, and camera descriptors.
- Match lifecycle state is split into dedicated `engine.n.goldrushMatch`, `goldrushFinalRush`, `goldrushExtractionReceipts`, `goldrushRoomHandoffReceipts`, `goldrushScoring`, `goldrushResults`, and `goldrushReplaySummary` APIs.
- Legacy source intake state is exposed through `engine.n.goldrushLegacySources`, backed by `manifests/import-jobs/goldrush-legacy-source-intake.json`, and must remain browser-safe with no raw/quarantine path strings in runtime source.
- Scoring, result finalization, receipt application, and replay summaries are kit-owned. The renderer and HUD may only present snapshots.
- Agent perspective packets live in `.agent/perspectives/` and simulate role, audience, market, player, runtime, import, and release viewpoints before broad changes.
- Network partitions target 50 simulated players each, with multi-room orchestration for 2-100 player matches hidden behind `goldrushNetwork`.
- `createNetworkOrchestrator().createSession()` owns live incremental room allocation: player 51 creates partition 2, leaves compact active roster assignments back toward partition 1, and high-water partitions stay retained until match end.
- Because the repository is public, `raw/imported/` is runtime quarantine only, not secrecy quarantine. Legacy files must be pre-scanned cloud-side before any raw import branch is pushed.
- Runtime code must never import or reference `raw/`, `quarantine/`, `sanitized/converted/`, legacy repo paths, Unity manifests, Photon/Fusion config, or plugin folders.
- Individual object dressing should be generated as stable `goldrush.micro.*` descriptors in `src/content/goldrushObjectMicroKits.js`, then batched by the renderer with instanced meshes. This is the local path for building thousands of small object kits without hand-authoring thousands of files.
- Object micro-kits should use the `micro-taxonomy-v2` shape with kit id, archetype, role, biome, placement zone/cluster/anchor/avoid tags, visual batch metadata, transform, and debug provenance.
- Terrain patch descriptors remain the orchestration/data contract, but the visible terrain mesh should render as a continuous field so tessellation does not expose blue/debug seams.
- Sky/terrain blending must not use a visible dome primitive in front of the player; the sky should read as background atmosphere plus horizon blend.
- `engine.n.goldrushCamera` owns a deterministic 1,000-pose camera perspective catalog across 10 player-view families. The active camera is selected from this catalog and carries playability checks instead of being treated as one hardcoded screenshot angle.
- Gold Rush visual composition should be driven by world/environment understanding, not by matching one reference picture. Reference images provide object vocabulary only; environment-space descriptors own canyon basin, wash floor, ridge walls, mine shelf, town shelf, gold seam, and extraction sightline placement logic.
- Gold Rush iteration should use a live one-change playtest loop: Codex verifies or launches the debug URL, the user plays, the user reports exactly one thing to change, Codex implements that one change, validates, screenshots, and repeats.
- The lobby should read as a squad staging screen inspired by modern battle-royale lobby composition: central character/pedestal, four party slots, compact group-type dropdown, PeerJS party-code controls, and one leader-only launch action. The party lobby caps at 4 players, while the first leader-launched mass match starts at 20 players.
- Start-screen audio should avoid sustained humming oscillator beds. Use short plucked/tapped procedural cues until approved legacy audio is imported.
- Scene loading is split into explicit sites so each scene can mount different kit groups: `site.start`, `site.lobby-character`, `site.loading-yard`, and `site.gold-field`.
- Scene-site kit groups are runtime-visible through `createGoldRushSceneKitLoader()` activation receipts, `window.GoldRushHost.getState().sceneKitLoader`, and `loadedKitGroups`, so each scene can load a different kit stack through dynamic renderer imports.
- The lobby character must be an actual Three.js character preview that spins in place on pointer drag, not a CSS/2D character.
- The party leader `Start` flow enters a loading-yard scene before the mass match. The local player can walk to the train, the train departs, and only then does the app hand off to the 20-player gold-field runtime.
- Loading-yard train motion is path-driven through `createTrainPathKit()` Bezier samples. The train must approach, open its door, lock the boarded player to the train anchor, then depart along the track; sideways linear train drift is invalid.
- Terrain height/color math, tessellation bands, and downward raycast placement are owned by `src/physics/terrainCollider.js`. Renderers import them, movement samples them, and duplicate renderer-local terrain algorithms are invalid.
- The current terrain collider is a sampled heightfield descriptor with a real `cannon-es` adapter in `src/physics/cannonTerrainPhysics.js`; local movement uses `raycastTerrainDown()` plus `sampleTerrainCollider()` for grounding, slope checks, step-up limits, and central mountain blockers. `src/physics/physicsBackendKit.js` records the active decision: keep `cannon-es` for the current static-heightfield slice and add Rapier later behind the same public physics API for capsule/kinematic character control.
- Near-play terrain is the upper visible/collidable band where tessellation bands overlap, so player footing uses the detailed local surface instead of the coarse far-horizon triangles.
- Terrain render continuity is validated by `tools/validation/validate-terrain-continuity.mjs`. The blue/debug-looking terrain gaps were caused by downward-wound visible terrain triangles; `createBandedTriangleTerrainGeometry()` now winds top faces upward, carves coarse terrain band top faces beneath finer bands, adds band continuity metadata, and skirts exposed band edges without changing the collider/raycast contract.
- Run-scene and loading-yard movement are mouse-look driven: `localPlayer.look.yaw` controls the over-the-shoulder camera, and WASD movement is relative to that camera yaw.
- `engine.n.goldrushExtractionLoop` owns the local playable mining/carry/extract slice. It is the authority for mining progress, local combat pressure, extraction progress, final receipt, and world-space marker descriptors; the renderer only presents those descriptors.
- Player grounding is movement-owned: `createMovementController()` samples the terrain once for the player frame and exposes `localPlayer.renderGround`. Renderers should consume that cached render-ground height instead of recomputing local player Y from presentation terrain.
- Character walk animation should not pulse the whole player root vertically. Root height stays grounded; readable motion belongs in limb rigs, knees, boots, torso sway, camera response, or authored animation clips.
- Loading-yard boarding should be forgiving along the rail/platform approach, not a single tiny trigger circle, so normal walking and automated proof captures can reliably reach the train handoff.
- Public deploy readiness is not proven by `npm run check` alone. The Build deploy workflow runs `npm run proof:public` after GitHub Pages publishes, and that proof must validate the public URL through title, lobby, loading-yard train boarding, and the 20-player gold-field run scene.

## Current Scaffold

- Vite static app.
- Three.js presentation surface.
- Gold Rush room orchestration data model.
- Import/sanitize validation placeholder.
- Room orchestration and runtime-boundary validators.
- Import-boundary and report-secret validators for cloud-side preflight reports.
- Gold Rush custom domain service kits install into NexusRealtime with `engine.n.goldrush*` APIs.
- Placeholder asset slots define stable IDs for future sanitized legacy assets without referencing raw source files.
- Scene, transition, audio, and animation slots are placeholder IDs owned by `engine.n.goldrushScenes` until cloud-side sanitized legacy files are promoted.
- Procedural renderer kits in `src/renderer/proceduralKits.js` are validated one by one before composition.
- Object micro-kits currently generate 3,105 individual object descriptors across 34 families and 17 authored placement zones, validated by `tools/validation/validate-procedural-renderer-kits.mjs`.
- The camera perspective catalog currently generates 1,000 serializable poses across exploration, trail, canyon, mining, town, combat, cover, extraction, spectate, and replay families, validated by `tools/validation/validate-nexus-runtime.mjs`.
- Environment-space understanding is now exposed through `world.environmentSpaces` and `goldrush.worldUnderstanding.environmentSpace`; every object micro-kit carries an `environmentSpaceId` so prop placement explains the playable space instead of copying a picture.
- The active playtest checkpoint is `http://localhost:5177/NexusEngine-GoldRush/`; `.agent/active/live-playtest-loop.md` tracks the one-change debug workflow.
- The `goldrush-microkit-readability-pass-01` direction is to reduce open-field noise, use explicit placement roles, and prefer readable mine/gold/canyon clusters over even scatter.
- Current visual proof shows town silhouettes and route readability improving, but high-fidelity authored prop geometry remains the next visual bottleneck.
- World element descriptors live in `src/content/goldrushWorldElements.js` and are validated by `tools/validation/validate-world-elements.mjs`.
- Current role/market packets include creative director, expert C# developer, Unity port developer, technical art director, Nexus runtime architect, marketing lead, player segments, creator/influencer, market research, market itself, and storefront positioning.
- Current match lifecycle proof covers final rush pressure, extraction receipts, handoff receipts, team scoring, final result state, and replay summary through `npm run check` plus browser screenshot proof in `reports/browser-match-lifecycle.png`.
- Current asset intake proof covers two legacy source projects and 19 promotion slots, with readiness intentionally at `0/19` until cloud-approved assets replace placeholders.
- Current network-kit direction is tracked in `.agent/active/network-kit.md`; resolved architecture packets live in `.agent/resolved/`.
- Latest network session validation proves `joinPlayer`, `leavePlayer`, duplicate join rejection, 101-player rejection, player-51 partition creation, and retained empty partition 2 after dropping below 51.
- GitHub Actions deploy workflow for the `Build` branch.
- PeerJS is installed for the party-code lobby layer. `src/network/peerPartyRoom.js` owns create-code, join-code, four-player cap, leader-only launch, and `start-match` broadcast behavior.
- Latest lobby proof shows a two-tab PeerJS join with the host at `hosting / 2/4` at `.playwright-cli/page-2026-06-29T08-52-31-485Z.png`.
- Latest launch proof shows the leader handoff into a 20-player runtime match at `.playwright-cli/page-2026-06-29T08-49-41-599Z.png`.
- Scene-site registry lives in `src/scenes/goldRushSceneSites.js`; its local validation is `tools/validation/validate-scene-sites.mjs`.
- Latest 3D lobby character proof is `.playwright-cli/page-2026-06-29T10-27-14-089Z.png`; Playwright verified drag rotation changed from `-0.22` to `1.376`.
- Latest loading-yard train proof is `.playwright-cli/page-2026-06-29T10-27-30-857Z.png`; latest post-train handoff proof is `.playwright-cli/page-2026-06-29T10-28-34-680Z.png` with runtime state `screen: run`, `players: 20`.
- Terrain collider validation lives in `tools/validation/validate-terrain-collider.mjs`; runtime debug state exposes `terrainCollider`, `terrainPhysics`, and `localPlayer.ground`.
- Latest terrain/movement proof is `.playwright-cli/page-2026-06-29T11-02-18-085Z.png`: Playwright verified Cannon heightfield metadata, near-band downward raycast placement, mouse-look yaw `-0.676`, and W movement relative to that yaw.
- `engine.n.goldrushReality` exposes real/prototype/cloud-blocked domain status so placeholder content cannot be mistaken for final parity. It currently marks legacy assets and actual audio/music as `blocked-cloud-import`; character rig, animation clips, combat, mining/gold, and train-loading polish as `prototype`; and local network, PeerJS party, scene-kit loading with receipts, NexusRuntime kits, and terrain collider as `real-local`.
- Reality status validation lives in `tools/validation/validate-reality-status.mjs`; app debug state exposes `realityStatus` and `realityValidation`.
- Extraction-loop validation lives in `tools/validation/validate-goldrush-extraction-loop.mjs`; latest browser proof walked title -> lobby -> loading train -> gold field -> mine seam -> extraction and produced accepted receipt `extraction-loop-01.goldrush-run-1.receipt` with `cargoValue: 840` in `reports/goldrush-extraction-loop-01.json`.
- The current extraction-loop screenshot proof is `screenshots/goldrush-extraction-loop-01.png`; it proves the interaction/receipt path, while the remaining blue/debug-looking terrain gaps stay visual debt for a separate terrain human-view pass.
- Latest terrain-gap proof is `screenshots/terrain-gap-seal-01.png` with `reports/terrain-gap-seal-01.json`; browser canvas sampling found `lowerSkyBlueRatio: 0` and `lowerVeryBlueRatio: 0`. The next visual debt is central mountain scale/framing, not terrain holes.
- Latest grounding/knee/pulse proof is `reports/grounding-knees-stability-01.md` with screenshot `screenshots/grounding-knees-stability-video-proof.png`, video `reports/videos/grounding-knees-stability-video-proof.webm`, and frame summary `reports/frame-analysis/grounding-pulse-summary.json`. It proves cached render grounding, knee-based leg animation, and no measured every-other-frame pulse in the stationary post-fix player crop.
- Latest public Pages smoke proof is `reports/public-smoke/public-smoke-2026-06-29T18-53-53-588Z.json` with screenshots under `screenshots/public-smoke/`. It proves the live public URL loads title -> lobby -> loading yard -> train handoff -> `site.gold-field`, creates a 20-player match, loads the procedural terrain kit group, exposes camera-relative WASD, visible-band terrain raycast placement, `cannon-es` terrain physics, and passing reality validation.

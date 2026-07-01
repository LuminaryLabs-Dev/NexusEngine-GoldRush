# Playtest Change Receipts

Status: active

## Purpose

Each live playtest loop should produce one receipt for one user-requested change. This keeps the build moving through visible player feedback instead of broad unsorted critique.

## Receipt Format

```txt
Receipt ID:
Date:
Debug URL:
User one-change request:
Before proof:
Files changed:
Validation:
After proof:
Human-view result:
Next one-change request:
```

## Rules

- One receipt equals one change.
- Do not combine unrelated visual, gameplay, camera, audio, or network requests into one receipt.
- If the request is broad, Codex should ask the user to pick the first single change.
- Every implemented receipt needs `npm run check` unless the change is docs-only.
- Every visible change needs a Playwright screenshot.

## Completed Receipt

```txt
Receipt ID: playtest-change-apex-like-lobby
Date: 2026-06-29
Debug URL: http://localhost:5177/NexusEngine-GoldRush/
User one-change request: make the lobby look almost like Apex's screen
Before proof: codex-clipboard-5760e8ab-e5a6-4c5c-afb0-fce8c73dd1e2.png
Files changed: src/app/goldRushApp.js, src/styles.css, memory.md, .agent/active/live-playtest-loop.md, .agent/active/playtest-change-receipts.md, <documents>/ME/GoldRush/.agent/goal.md
Validation: `npm run check` passed; `npm run playtest:doctor` passed
After proof: .playwright-cli/page-2026-06-29T08-36-08-244Z.png
Human-view result: lobby now uses a squad-staging composition with central skeleton prospector, four party slots, Group Type dropdown, and Load Into Match action
Next one-change request: waiting
```

```txt
Receipt ID: playtest-change-peerjs-party-lobby-audio
Date: 2026-06-29
Debug URL: http://localhost:5177/NexusEngine-GoldRush/
User one-change request: make the lobby its own PeerJS room for up to four players by code, let the party leader launch a 20-player mass room, and change the humming audio
Before proof: .playwright-cli/page-2026-06-29T08-36-08-244Z.png
Files changed: package.json, package-lock.json, src/network/peerPartyRoom.js, src/app/goldRushApp.js, src/styles.css, tools/validation/validate-live-playtest.mjs, memory.md, .agent/active/live-playtest-loop.md, .agent/active/playtest-change-receipts.md, <documents>/ME/GoldRush/.agent/goal.md
Validation: `npm run check` passed; `npm run playtest:doctor` passed; Playwright Create Code showed hosting / 1/4; two-tab Playwright join showed host hosting / 2/4 and follower joined / 2/4; Playwright runtime state showed screen run, players 20, phase prospect
After proof: .playwright-cli/page-2026-06-29T08-52-31-485Z.png and .playwright-cli/page-2026-06-29T08-49-41-599Z.png
Human-view result: lobby now creates a PeerJS party code, accepts a second browser by code, keeps four party slots, gates mass launch to the leader, launches a 20-player match, and uses short plucked/tapped procedural audio instead of a sustained hum
Next one-change request: waiting
```

```txt
Receipt ID: playtest-change-scene-sites-3d-lobby-train-loading
Date: 2026-06-29
Debug URL: http://localhost:5177/NexusEngine-GoldRush/
User one-change request: add multiple scene sites so different scenes can load different kit groups; make the lobby character an actual draggable Three.js 3D character; make Start load a small train scene where the player can walk to the train before it rides away
Before proof: .playwright-cli/page-2026-06-29T08-52-31-485Z.png
Files changed: src/scenes/goldRushSceneSites.js, src/renderer/lobbyCharacterRenderer.js, src/renderer/loadingTrainSceneRenderer.js, src/app/goldRushApp.js, src/styles.css, tools/validation/validate-scene-sites.mjs, tools/validation/validate-live-playtest.mjs, docs/scene-sites.md, package.json, memory.md, .agent/active/live-playtest-loop.md, .agent/active/playtest-change-receipts.md, <documents>/ME/GoldRush/.agent/goal.md
Validation: `npm run check` passed; `npm run playtest:doctor` passed; Playwright verified lobby active site `site.lobby-character`, drag rotation changed from -0.22 to 1.376, loading-yard active site `site.loading-yard`, W walk triggered train departure, final active site `site.gold-field` with players 20
After proof: .playwright-cli/page-2026-06-29T10-27-14-089Z.png, .playwright-cli/page-2026-06-29T10-27-30-857Z.png, .playwright-cli/page-2026-06-29T10-28-34-680Z.png
Human-view result: scene loading is now split by site/kit group; lobby uses a real draggable Three.js character; Start enters a walkable train-yard loading scene before the main match
Next one-change request: waiting
```

## Completed Receipt

```txt
Receipt ID: playtest-change-scene-kit-groups-terrain-collider
Date: 2026-06-29
Debug URL: http://localhost:5177/NexusEngine-GoldRush/
User one-change request: multiple scene sites should load kit groups differently, and the terrain needs a collider
Before proof: .playwright-cli/page-2026-06-29T10-28-34-680Z.png
Files changed: src/scenes/goldRushSceneSites.js, src/physics/terrainCollider.js, src/app/goldRushApp.js, src/renderer/proceduralKits.js, tools/validation/validate-terrain-collider.mjs, tools/validation/validate-procedural-renderer-kits.mjs, tools/validation/validate-scene-sites.mjs, tools/validation/validate-live-playtest.mjs, docs/scene-sites.md, docs/terrain-collider.md, package.json, memory.md, .agent/active/playtest-change-receipts.md, <documents>/ME/GoldRush/.agent/goal.md
Validation: `npm run check` passed; `npm run playtest:doctor` passed; Playwright state confirmed `activeSite: site.gold-field`, loaded kit groups `goldrush-runtime`, `procedural-terrain`, `object-micro-kits`, `network-orchestration`, 20 players, heightfield collider id `goldrush.terrain.collider.heightfield`, 5,073 samples, and `cannon-es-heightfield`/`rapier-heightfield` bridge targets; movement proof changed local player ground from `-0.8924` to `-0.5724`
After proof: .playwright-cli/page-2026-06-29T10-47-37-303Z.png
Human-view result: gold-field now exposes its scene-specific kit groups and the over-the-shoulder player is grounded by the shared sampled heightfield collider instead of floating on a renderer-only terrain estimate
Next one-change request: waiting
```

## Completed Receipt

```txt
Receipt ID: playtest-change-cannon-terrain-mouse-look
Date: 2026-06-29
Debug URL: http://localhost:5177/NexusEngine-GoldRush/
User one-change request: place the player by raycasting down, make a terrain collider, and make camera look mouse-based with WASD moving relative to camera direction
Before proof: .playwright-cli/page-2026-06-29T10-47-37-303Z.png
Files changed: src/physics/terrainCollider.js, src/physics/cannonTerrainPhysics.js, src/app/goldRushApp.js, src/renderer/proceduralKits.js, tools/validation/validate-terrain-collider.mjs, tools/validation/validate-procedural-renderer-kits.mjs, tools/validation/validate-live-playtest.mjs, docs/terrain-collider.md, memory.md, .agent/active/playtest-change-receipts.md, <documents>/ME/GoldRush/.agent/goal.md
Validation: `npm run check` passed; `npm run playtest:doctor` passed; direct Cannon validation created a real `cannon-es` `World`, static `Body`, and `Heightfield` shape with 57 rows, 89 columns, 5,073 samples, and mass 0; Playwright proved mouse drag changed yaw to `-0.676`, W moved the player from `(-12, -20)` to about `(-17.23, -13.48)`, and ground placement stayed on `downward-triangle-raycast` / `near-play-band`
After proof: .playwright-cli/page-2026-06-29T11-02-18-085Z.png
Human-view result: player placement now raycasts down to the top detailed terrain band, the debug state exposes real Cannon heightfield physics, and WASD movement follows mouse-look camera yaw
Next one-change request: waiting
```

## Completed Receipt

```txt
Receipt ID: playtest-change-incremental-network-session
Date: 2026-06-29
Debug URL: http://localhost:5177/NexusEngine-GoldRush/
User one-change request: continue the active goal by replacing fake room generation with real incremental 50-player room orchestration
Before proof: .playwright-cli/page-2026-06-29T11-02-18-085Z.png
Files changed: src/network/networkOrchestrator.js, src/rooms/roomOrchestrator.js, src/kits/goldRushDomainKits.js, tools/validation/validate-network-kit.mjs, tools/validation/validate-room-orchestration.mjs, tools/validation/validate-nexus-runtime.mjs, tools/validation/validate-live-playtest.mjs, docs/network-kit-contract.md, docs/room-orchestration.md, memory.md, .agent/active/network-kit.md, .agent/active/playtest-change-receipts.md, <documents>/ME/GoldRush/.agent/goal.md
Validation: `npm run check` passed; `npm run playtest:doctor` passed; `node tools/validation/validate-network-kit.mjs` proved player 51 creates partition 2, duplicate joins reject, player 101 rejects, player 51 leave retains partition 2, and early-slot leave compacts active players back into partition 1 while partition 2 stays retained
After proof: runtime validator proof, non-visual network session change
Human-view result: no visible UI change; the network layer behind the match now has a live incremental session allocator instead of only static player-count generation
Next one-change request: waiting
```

## Current Waiting Receipt

## Completed Receipt

```txt
Receipt ID: playtest-change-reality-status-kit
Date: 2026-06-29
Debug URL: http://localhost:5177/NexusEngine-GoldRush/
User one-change request: identify what is currently fake and keep working toward replacing fake layers without touching old repos locally
Before proof: .playwright-cli/page-2026-06-29T11-02-18-085Z.png
Files changed: src/content/goldrushRealityStatus.js, src/kits/goldRushDomainKits.js, src/app/goldRushApp.js, tools/validation/validate-reality-status.mjs, package.json, docs/reality-status.md, docs/scene-sites.md, memory.md, .agent/active/playtest-change-receipts.md, .agent/active/live-playtest-loop.md, <documents>/ME/GoldRush/.agent/goal.md
Validation: `npm run check` passed; `npm run playtest:doctor` passed; `node tools/validation/validate-reality-status.mjs` reports 6 real-local domains, 5 prototype domains, 2 cloud-blocked domains, 1 pending external deploy proof, 44 placeholder slots, 0 promoted assets, 0 promoted audio, and 0 promoted animations
GPT-it: attempted through isolated runner; transcript written to `<github>/Crimson/Apps/CopilotResearch/chatgpt_runs/chatgpt_run_20260629_072550_1prompts.md`; blocked by `composer missing`
After proof: .playwright-cli/page-2026-06-29T11-37-54-591Z.png; browser state showed `realityStatus.summary` with 14 domains, 44 placeholder slots, 0 promoted assets, and 0 promoted audio
Human-view result: no visible UI change; app/debug state now exposes a machine-readable truth ledger so fake/prototype/cloud-blocked domains are explicit instead of implied
Next one-change request: waiting
```

```txt
Receipt ID: playtest-change-next
Date: 2026-06-29
Debug URL: http://localhost:5177/NexusEngine-GoldRush/
User one-change request: waiting for user
Before proof: .playwright-cli/page-2026-06-29T11-02-18-085Z.png
Files changed: none yet
Validation: waiting
Preflight: `npm run check`, `npm run playtest:doctor`, and Playwright reality-status browser proof passed after adding the reality-status kit
After proof: waiting
Human-view result: waiting
Next one-change request: waiting
```

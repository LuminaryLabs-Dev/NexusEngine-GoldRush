# NexusEngine Gold Rush Goal

## Objective

Build Gold Rush as a NexusRealtime-driven multiplayer extraction battle royale that merges both legacy Gold Rush Unity projects into one browser-playable game.

## Required End State

- Legacy assets from both old Gold Rush projects are copied into this repo through GPT/cloud-side transfer.
- The next GPT/cloud-side transfer must follow `manifests/import-jobs/goldrush-cloud-transfer-handoff.json`.
- Raw files land in `raw/imported/<jobId>/` only.
- Sanitation outputs land in `sanitized/`.
- Browser runtime assets land in `public/assets/` only after approval.
- Approved runtime asset metadata lands in `src/content/goldrushApprovedAssets.js` and overlays placeholder slots only after provenance, hashes, approval, and safe `assets/...` paths validate.
- The app deploys from the `Build` branch.
- The public Pages URL must be smoke-tested after deployment with `npm run proof:public`.
- The game uses NexusRealtime as the runtime contract and custom Gold Rush kits for orchestration.
- NexusRealtime is the core runtime contract.
- NexusRealtime-Kits and ProtoKits are reusable domain sources.
- Generic NexusRealtime-style kits incubate locally inside `src/kits/generic-incubator/` before any later graduation to NexusRealtime.
- `engine.n.goldrushKitContracts` must expose the two-layer kit pairings and validate that generic kits stay neutral while GoldRush kits own game-specific rules.
- NexusRealtime and ProtoKits source-doc alignment is tracked by `manifests/source-docs/nexus-kit-source-alignment.json` and validated by `tools/validation/validate-nexus-source-alignment.mjs`.
- The reusable ProtoKit route/cargo/extraction stack is loaded through `engine.n.goldrushProtoKitBridge`, validated by `tools/validation/validate-goldrush-protokit-bridge.mjs`, while `engine.n.goldrushExtractionLoop` remains the GoldRush-specific orchestrator.
- 2-100 players are supported by `engine.n.goldrushNetwork`; 50-player room partitions are internal implementation detail.

## Room Model

```txt
match
├─ lobby room
├─ internal partition A: players 1-50
├─ internal partition B: players 51-100
├─ shared match ledger
├─ extraction/cashout ledger
└─ final scoring ledger
```

Network rooms are generated incrementally behind `goldrushNetwork`. The app must never require all 100 players to exist before the match can begin, and first-screen UX should not focus on player joining.

## Game Loop

```txt
lobby
-> drop
-> prospect
-> carry gold
-> combat or evade
-> extract/cash out
-> pressure collapse
-> final rush
-> match result
```

## Perspective Rule

Exploration, traversal, mining, and extraction use an over-the-shoulder travel camera. Combat switches to a closer over-the-shoulder aim camera and combat HUD state.

The camera system must be treated as a kit-owned playability proof surface, not one fixed angle. `engine.n.goldrushCamera` should expose a deterministic 1,000-pose perspective catalog across exploration, trail-follow, canyon-scout, mining-close, town-approach, combat-shoulder, cover-peek, extraction-run, spectate-crew, and replay-cinematic families. The renderer consumes the selected `threeDescriptor`; playability proof comes from sampling many families and verifying player silhouette, route, landmarks, cover, threats, gold, and terrain depth remain readable.

## World Understanding Rule

The visual target is the space of a playable gold-rush canyon environment, not a one-to-one copy of a reference picture. Reference images provide vocabulary only. Composition must come from environment-space descriptors: canyon basin, wash-floor trail, ridge walls, mine shelf, town shelf, gold seam, and extraction sightline. Props and cameras must explain those spaces first.

## Current Feedback Tracking

- Feedback bugs are tracked in `.agent/feedback/`.
- `BUG-003-character-legs-need-knees.md` is resolved locally by the two-part knee rig pass.
- `BUG-004-frame-to-frame-terrain-player-pulsing.md` is mitigated locally by cached movement-owned render grounding and native-frame crop evidence.
- `BUG-005-loading-train-sideways-and-no-boarding-sequence.md` is in active fix: train motion must follow a path, open a door, lock the player to the train, and hand off after departure.
- `BUG-006-physics-backend-and-terrain-mesh-reliability.md` is in active fix: use the current Cannon heightfield reliably, keep Rapier as a future adapter, and remove stacked terrain surfaces that cause flicker.
- `BUG-002-central-mountain-scale-and-camera-framing.md` remains open and is the next visible terrain composition issue.

## Current Public Proof

```txt
https://luminarylabs-dev.github.io/NexusEngine-GoldRush/
```

Latest passing public smoke proof:

```txt
reports/public-smoke/public-smoke-2026-06-29T21-03-19-253Z.json
screenshots/public-smoke/04-gold-field-2026-06-29T21-03-19-253Z.png
```

This proof validates title -> lobby -> loading-yard train -> run scene, a 20-player match, active `site.gold-field`, procedural terrain kit loading, camera-relative WASD, visible-band terrain raycast, `cannon-es` terrain physics, and passing reality validation.

## Current Asset Transfer Handoff

```txt
manifests/import-jobs/goldrush-cloud-transfer-handoff.json
```

Local validation:

```txt
node tools/validation/validate-cloud-transfer-handoff.mjs
```

This packet is ready for GPT/cloud workers to execute. It keeps local Codex out of legacy repo clones, requires both Unity roots and scene evidence, blocks Unity/project/plugin/config folders, maps copy domains to runtime slots, and requires scan/provenance/conversion/human-review reports before promotion.

## Current Approved Runtime Asset Gate

```txt
src/content/goldrushApprovedAssets.js
tools/validation/validate-approved-asset-registry.mjs
```

The approved registry is intentionally empty while cloud import is pending. Empty state passes validation and keeps runtime placeholders active. Future approved records must target existing slots, use `sourceJobId: goldrush-dual-source-001`, include source/output hashes and approval metadata, point to committed files under `public/assets/` through browser-relative `assets/...` paths, and match the runtime file hash.

## Current Nexus Source Alignment Gate

```txt
manifests/source-docs/nexus-kit-source-alignment.json
docs/nexus-source-alignment.md
tools/validation/validate-nexus-source-alignment.mjs
```

This gate anchors GoldRush to the installed NexusRealtime README and ProtoKits DSM/DSK docs. It checks source doc hashes and anchors, package-lock commits, local domain-kit mappings, non-adapter renderer boundaries, headless GoldRush runtime kit installation, ProtoKit construction with NexusRealtime, and the local ME goal ledger markers.

## Current ProtoKit Runtime Bridge

```txt
src/kits/protokits/goldRushProtoKitBridge.js
docs/goldrush-protokit-bridge.md
tools/validation/validate-goldrush-protokit-bridge.mjs
```

The bridge loads `generic-route-progress-kit`, `generic-resource-loop-kit`, `generic-pressure-loop-kit`, and `generic-route-cargo-extraction-kit` from `@luminarylabs/nexusrealtime-protokits`. It maps them to GoldRush checkpoints `mine-seam -> carry-gold -> cashout-site`, `gold` cargo, and `ambush-pressure`. The imported stack is hosted in an isolated NexusRealtime runtime because direct main-engine ticking currently overflows inside the imported composite stack; the bridge still proves the main GoldRush runtime can tick with the bridge installed.

Live runtime actions now mirror into the bridge: mining completes `mine-seam` and adds gold, combat damage increases `ambush-pressure` and spends lost cargo, successful cashout completes `carry-gold` and `cashout-site`, and `goldrushScenario.snapshot().protoKitBridge` exposes the bridge state for browser proof. GoldRush-specific scoring and receipts remain owned by `engine.n.goldrushExtractionLoop`, `engine.n.goldrushExtractionReceipts`, and `engine.n.goldrushScoring`.

## Current Legacy Version Selection

The lobby exposes a secondary `Version Source` foldout backed by `engine.n.goldrushLegacyModes`. Players can launch `modernExtraction`, `classicCombat`, or `classicSolo` through the same app flow. Local browser proof selected `classicCombat`, boarded the train, entered `site.gold-field`, and ended with `legacyMode.activeModeId: classicCombat`, `sceneState.currentSceneId: goldrush.scene.legacyGame`, `cameraMode: combat`, and `legacyMode.unifiedRuntime.oneGame: true`.

## Current Cloud Asset Receipt Gate

The remaining asset/audio blocker now has a strict local acceptance gate before promotion. Cloud-side raw copy work must provide `reports/provenance/goldrush-dual-source-001-source-discovery.json`, `quarantine/reports/goldrush-dual-source-001-deny-path-scan.json`, `reports/secret-scans/goldrush-dual-source-001.json`, `reports/provenance/goldrush-dual-source-001-copy-ledger.json`, `reports/provenance/goldrush-dual-source-001-hashes.json`, and `reports/asset-classification/goldrush-dual-source-001-classification.json`. `tools/validation/validate-cloud-asset-receipts.mjs` passes in the pre-import state as `waiting-for-cloud-asset-receipts` and becomes strict as soon as raw candidates or any receipt appears. `.github/workflows/validate-cloud-import.yml` requires receipts on cloud import branches so an empty import branch cannot pass.

The receipt gate now also validates against the raw-copy plan. After cloud evidence appears, the copy ledger, hash manifest, raw candidate files, and classification report must exactly cover the 31 selected raw-copy plan files with matching source paths, target raw paths, sizes, and domain ids. The eight deferred slots remain explicitly unresolved and must not be copied by the first raw-copy pass.

The repo now has a guarded executable worker for the raw-copy pass:

```txt
tools/import-sanitize/copy-raw-plan-from-github.mjs
tools/validation/validate-raw-copy-worker.mjs
```

Default mode is a no-fetch/no-write dry run. `--fetch` downloads selected source blobs in memory and proves hashes/secret checks without writing. `--write --confirm-public-raw-import-risk` writes raw files and the six receipt files, and must be used only on `import/goldrush-dual-source-001-raw` because this destination repo is public.

Latest fetch-only proof:

```txt
reports/provenance/goldrush-dual-source-001-raw-copy-worker-fetch-proof.json
```

It proves the worker can download the 31 planned source blobs through GitHub API access, build 31 copy-ledger records, 31 hash records, 31 classification records, and find 0 secret findings without writing raw files or receipts.

## Current Raw Import Branch

```txt
branch: import/goldrush-dual-source-001-raw
raw root: raw/imported/goldrush-dual-source-001/
raw files: 31
raw bytes: 42,215,234
classification candidates: 31
blocked: 0
unmapped: 0
```

This branch contains the first direct copied legacy files and the six required receipts. It is not a runtime promotion branch: `public/assets/` remains untouched, approved runtime asset records remain empty, and the final playable parity goal still requires conversion, human review, promotion, and browser proof.

## Current Cloud Source Access Proof

```txt
reports/provenance/goldrush-source-access-2026-06-29.json
tools/validation/validate-source-access-proof.mjs
```

This proof verifies cloud/GitHub-side access to `thecrimsondeveloper/Gold_Rush` branch `development` at `144230e32b537336c83407b4ddae83cdc95c1c9e` without cloning a legacy repo locally. It proves both source roots, product names, Unity versions, and required scene blobs for `GoldRush/` and `GoldRush_Old/`.

This is not the raw-copy receipt. It does not satisfy the final asset/audio import requirement, but it gives the next GPT/cloud worker exact source evidence to use before producing the mandatory receipt set.

## Current First Cloud Copy Slice

```txt
manifests/import-jobs/goldrush-cloud-first-copy-slice.json
tools/validation/validate-cloud-first-copy-slice.mjs
```

This packet is the next executable cloud-worker target. It uses the source-access proof and the cloud-transfer handoff to define the smallest safe first raw-copy slice:

```txt
audio-music-and-sfx
legacy-scene-layout-metadata
player-combat-character
mine-town-terrain-props
```

It validates 4 domains, 6 required receipt files, and 29 runtime slot targets. It is still pre-copy: no raw files, converted files, approved runtime assets, or final legacy audio assets are claimed complete until the cloud import branch contains the required receipts and passes strict receipt validation.

## Current Source Discovery Receipt Generator

```txt
tools/import-sanitize/generate-cloud-source-discovery.mjs
tools/validation/validate-source-discovery-generator.mjs
```

The generator converts the source-access proof into the required `nexusengine.goldrush.cloud-source-discovery.v1` receipt shape for the cloud import branch. It defaults to stdout and refuses to write `reports/provenance/goldrush-dual-source-001-source-discovery.json` unless the worker passes `--allow-receipt-write`, preventing a local partial receipt from triggering the receipt gate.

This helps the cloud worker start the raw-copy branch with a correct source-discovery receipt, but it still does not satisfy the raw-copy, deny-scan, secret-scan, hash, copy-ledger, or classification requirements by itself.

## Current Cloud Candidate Inventory

```txt
reports/provenance/goldrush-dual-source-001-candidate-inventory.json
tools/import-sanitize/generate-cloud-candidate-inventory.mjs
tools/validation/validate-cloud-candidate-inventory.mjs
```

This metadata-only inventory uses the GitHub tree API for source commit `144230e32b537336c83407b4ddae83cdc95c1c9e`; it does not clone the source repo and does not copy file contents. Current inventory:

```txt
audio-music-and-sfx: 18 candidates
legacy-scene-layout-metadata: 6 candidates
player-combat-character: 47 candidates
mine-town-terrain-props: 725 candidates
total: 796 candidates, 631,521,909 listed source bytes
```

This moves the cloud worker closer to raw copy by identifying exact candidate paths/blob SHAs, but it is still not a raw copy, deny scan, secret scan, copy ledger, hash manifest, classification receipt, conversion, review, or runtime promotion.

## Current Cloud Raw Copy Plan

```txt
reports/provenance/goldrush-dual-source-001-raw-copy-plan.json
tools/import-sanitize/generate-cloud-raw-copy-plan.mjs
tools/validation/validate-cloud-raw-copy-plan.mjs
```

This metadata-only plan chooses the first raw files the cloud worker should copy into `raw/imported/goldrush-dual-source-001/` on `import/goldrush-dual-source-001-raw`. Current plan:

```txt
selected files: 31
selected source bytes: 42,215,234
explicit deferred slots: 8
```

Selected slots include wandering music, combat music, revolver shot, all six legacy/modern scene layout files, player/prospector candidates, revolver candidates, idle/run/shooting animation candidates, train/train-car candidates, gold pile, coin, cactus, and fence candidates.

Deferred slots are explicit: boss music, gold pickup SFX, cashout SFX, ambush SFX, player-down SFX, aim-idle animation, aim-run animation, and dead animation still need better source evidence or review.

This plan still does not copy assets and does not satisfy the final asset/audio requirement. It is the cloud worker's next concrete raw-copy target.

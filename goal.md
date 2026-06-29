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
- Generic NexusRealtime-style kits incubate locally inside `src/kits/generic-incubator/` before any later graduation to NexusRealtime.
- `engine.n.goldrushKitContracts` must expose the two-layer kit pairings and validate that generic kits stay neutral while GoldRush kits own game-specific rules.
- NexusRealtime and ProtoKits source-doc alignment is tracked by `manifests/source-docs/nexus-kit-source-alignment.json` and validated by `tools/validation/validate-nexus-source-alignment.mjs`.
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
reports/public-smoke/public-smoke-2026-06-29T18-53-53-588Z.json
screenshots/public-smoke/04-gold-field-2026-06-29T18-53-53-588Z.png
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

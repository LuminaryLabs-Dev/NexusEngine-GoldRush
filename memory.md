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
- Renderers own presentation only.
- Local Codex work may add or modify kits only inside `NexusEngine-GoldRush`; other kit repos are cloud/GPT-it inspection sources, not local edit targets.
- The visible Gold Rush terrain should be a massive procedural field made from many small tessellated patches, not a circular arena primitive.
- Towns, mountains, paths, gold zones, loading gates, and room patch windows are first-class world descriptors owned by `engine.n.goldrushWorld`.
- Terrain windows, town layouts, path networks, gold zones, loading gates, camera descriptors, audio state, and animation state should be exposed as dedicated NexusRealtime APIs rather than only nested world data.
- Browser validation can inspect `window.GoldRushHost.getState()` for scenario, world, terrain, town, path, gold-zone, loading-gate, audio, animation, and camera descriptors.
- Match lifecycle state is split into dedicated `engine.n.goldrushMatch`, `goldrushFinalRush`, `goldrushExtractionReceipts`, `goldrushRoomHandoffReceipts`, `goldrushScoring`, `goldrushResults`, and `goldrushReplaySummary` APIs.
- Scoring, result finalization, receipt application, and replay summaries are kit-owned. The renderer and HUD may only present snapshots.
- Agent perspective packets live in `.agent/perspectives/` and simulate role, audience, market, player, runtime, import, and release viewpoints before broad changes.
- Room shards target 50 players each, with multi-room orchestration for 2-100 player matches.
- Because the repository is public, `raw/imported/` is runtime quarantine only, not secrecy quarantine. Legacy files must be pre-scanned cloud-side before any raw import branch is pushed.
- Runtime code must never import or reference `raw/`, `quarantine/`, `sanitized/converted/`, legacy repo paths, Unity manifests, Photon/Fusion config, or plugin folders.

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
- World element descriptors live in `src/content/goldrushWorldElements.js` and are validated by `tools/validation/validate-world-elements.mjs`.
- Current role/market packets include creative director, expert C# developer, Unity port developer, technical art director, Nexus runtime architect, marketing lead, player segments, creator/influencer, market research, market itself, and storefront positioning.
- Current match lifecycle proof covers final rush pressure, extraction receipts, handoff receipts, team scoring, final result state, and replay summary through `npm run check` plus browser screenshot proof in `reports/browser-match-lifecycle.png`.
- GitHub Actions deploy workflow for the `Build` branch.

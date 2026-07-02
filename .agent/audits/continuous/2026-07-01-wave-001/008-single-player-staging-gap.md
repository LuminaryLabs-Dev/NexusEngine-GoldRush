# Single-player staging gap

Status: open
Audit wave: 2026-07-01-wave-001
Severity: high
Domain: staging/validation
Owning kit or workspace: n:goldrush:single-player-staging
Roadmap rows informed: 055, 066, 084, 086, 087, 088, 089, 093, 094

## Problem

The final game needs 60-player readiness, but day-to-day iteration needs a staging environment where one player can test the full loop with bots and deterministic scenarios.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- Scenario runner can start title, lobby, train, spawn, mine, carry, combat, extract, score, and results with deterministic seeds.
- Bot pressure is marked as staging proof, not live player proof.
- Replay artifacts can reproduce failures without local path leakage.

## Edge Cases To Hunt

- Staging controls leak into production UI.
- Bots skip terrain/camera constraints humans face.
- Replay artifact records too much or too little state.
- Scenario runner duplicates Playwright rather than layering under it.
- Crash telemetry records local machine paths.

## Deployment Issues To Hunt

- Public staging mode can expose debug-only controls if not gated.
- Retained reports must be sanitized by default.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Make single-player staging first-class, but keep its proof labels honest.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

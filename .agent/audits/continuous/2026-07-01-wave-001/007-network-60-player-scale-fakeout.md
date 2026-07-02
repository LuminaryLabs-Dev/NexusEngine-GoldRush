# Network 60-player scale fakeout

Status: open
Audit wave: 2026-07-01-wave-001
Severity: critical
Domain: network/runtime
Owning kit or workspace: n:network:room-partitions plus n:goldrush:room-orchestration
Roadmap rows informed: 078, 079, 080, 081, 082, 083, 084, 085, 091

## Problem

A single-browser or local simulated run can be mistaken for 60-player readiness unless partition, snapshot, bot-fill, prediction, rejoin, and failure behavior are separately proven.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- Simulator proof runs 60 participant snapshots with bounded payload sizes.
- Party lobby proof remains separate from large match partition proof.
- Prediction/reconciliation proof checks movement jitter and no duplicate cargo after reconnect.

## Edge Cases To Hunt

- Party leader leaves during train handoff.
- Player 51 creates a partition but handoff receipts assign stale room ids.
- Rejoin duplicates carried gold or extraction receipts.
- Bot fill hides network payload pressure.
- Anti-cheat sanity checks reject valid laggy input.

## Deployment Issues To Hunt

- PeerJS/browser relay behavior differs across public origins.
- Static Pages deploy cannot imply hosted authoritative backend.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Label every scale proof as local, simulated, browser-multi-tab, or live network before using it as evidence.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

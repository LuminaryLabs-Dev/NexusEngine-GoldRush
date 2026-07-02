# Interaction tactility fakeout

Status: open
Audit wave: 2026-07-01-wave-001
Severity: high
Domain: gameplay/UX
Owning kit or workspace: n:gameplay:interaction-hold plus n:goldrush:player-action-surface
Roadmap rows informed: 016, 056, 057, 058, 059, 060, 061, 063, 064, 066, 070

## Problem

Receipts can prove mining, cargo, cashout, and scoring while the player still feels like they pressed a hidden debug button.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- Natural player route proof completes mine -> carry -> cashout -> results without teleport or direct completion helpers.
- Hold progress, cancel, complete, audio, animation, and cargo state are visible and understandable.
- Each interactive object exposes a protokit affordance and raycast-grounded placement.

## Edge Cases To Hunt

- Interact key mines wrong object because nearest affordance is unclear.
- Hold progress continues after player walks away.
- Cargo changes score but not movement, posture, sound, or risk.
- Cashout starts while threat state says it should be interrupted.
- Tutorial text replaces readable world feedback.

## Deployment Issues To Hunt

- Public smoke can pass through proof-only helper APIs if not blocked.
- Mobile or non-pointer input may not trigger hold/cancel timing correctly.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Audit every receipt against the visible player action that caused it.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

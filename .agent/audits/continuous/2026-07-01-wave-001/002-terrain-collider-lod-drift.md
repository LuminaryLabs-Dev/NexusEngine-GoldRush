# Terrain collider and LOD drift

Status: open
Audit wave: 2026-07-01-wave-001
Severity: critical
Domain: physics/world/render
Owning kit or workspace: n:physics:collider plus n:world:terrain-heightfield
Roadmap rows informed: 023, 024, 025, 026, 034, 035, 090

## Problem

The player can appear to float, sink, pulse, or clip if collider parity and LOD continuity are treated as after-the-fact renderer fixes.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- One sampled height function feeds visual mesh, collider mesh, placement raycasts, and movement grounding.
- Motion proof samples multiple frames and reports no alternating-frame ground mismatch.
- LOD transition proof checks camera speed, sprint speed, and train movement speed.

## Edge Cases To Hunt

- Every-other-frame height sample flips between coarse and fine bands.
- Collider blocker is taller than visible mountain.
- Skirt geometry hides gaps but physics still has holes.
- Raycast down starts from the wrong local/world coordinate frame.
- Slope limit rejects valid walking paths around the central mountain.

## Deployment Issues To Hunt

- WebGL precision or devicePixelRatio changes can reveal seams only in public/browser proof.
- Different browser timing can expose alternating-frame LOD churn.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Treat terrain collider parity as a release gate for any authored mesh or LOD work.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

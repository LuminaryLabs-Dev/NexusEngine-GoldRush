# Map source drift

Status: open
Audit wave: 2026-07-01-wave-001
Severity: critical
Domain: world
Owning kit or workspace: n:goldrush:desert-world-map
Roadmap rows informed: 021, 022, 023, 024, 025, 026, 030, 031, 032, 033, 034, 035

## Problem

The current plateau can persist if visible terrain, collider terrain, route corridors, prop placement, gold zones, and extraction pads keep being generated as separate truths.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- Terrain looks large and authored from player height.
- Collider/raycast samples match the visible mesh at near, mid, and far travel points.
- Gold zones, towns, train paths, and extraction sites attach to named terrain masks.
- LOD chunks do not change gameplay height or route decisions.

## Edge Cases To Hunt

- Player stands on one band while visual mesh draws another.
- LOD seam moves the ground under the player during motion.
- Gold object raycasts use a different height sample than character grounding.
- Town pads float or cut into ridges after terrain scale changes.
- Extraction site is technically placed but hidden behind unreadable terrain.

## Deployment Issues To Hunt

- Public build can ship older terrain data than local if Build lags.
- Static asset base path can break future terrain chunk fetches.
- Heavy mesh data can pass local but exceed Pages/browser memory budgets.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Start implementation from authored map data, not from another renderer-only terrain patch.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

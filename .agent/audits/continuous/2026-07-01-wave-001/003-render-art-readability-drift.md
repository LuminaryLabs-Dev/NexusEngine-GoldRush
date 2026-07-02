# Render and art readability drift

Status: open
Audit wave: 2026-07-01-wave-001
Severity: high
Domain: render/art direction
Owning kit or workspace: n:render:three-scene plus n:goldrush:3d-scene-renderer
Roadmap rows informed: 014, 027, 028, 039, 040, 041, 045, 096

## Problem

The prototype can become denser without becoming higher fidelity if props stay primitive, colors stay flat, silhouettes are weak, and markers do the work the world should do.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- World screenshots show distinct terrain bands, landmarks, roads, towns, mines, gold zones, and extraction silhouettes without debug labels.
- Each repeated object type has a protokit contract and readable form.
- Toon shading improves depth and material identity instead of flattening the scene.

## Edge Cases To Hunt

- Clutter hides gold or cover cues.
- Mine, town, and extraction props share one unreadable material role.
- Large terrain makes objectives too small to read.
- Object markers compensate for poor asset silhouettes.
- Generated props look numerous but not authored.

## Deployment Issues To Hunt

- Low-end browser renders materials differently and collapses contrast.
- Public screenshots are stale compared with local art pass.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Use art readability audits before adding more objects; density is not a substitute for authored form.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

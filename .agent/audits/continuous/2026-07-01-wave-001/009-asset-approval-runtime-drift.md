# Asset approval and runtime drift

Status: open
Audit wave: 2026-07-01-wave-001
Severity: critical
Domain: content/legal/audio
Owning kit or workspace: n:goldrush:asset-pipeline
Roadmap rows informed: 036, 037, 038, 042, 043, 044, 045, 096, 099

## Problem

The repo can import useful candidates while still having zero approved runtime assets; the project must not confuse source candidates, raw copies, sanitized files, or review packets with playable public assets.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- Every runtime asset path is browser-relative and backed by an approved record.
- Candidate and raw files never appear in runtime imports.
- Audio cue promotion has license, provenance, approval, and fallback behavior.

## Edge Cases To Hunt

- Converted GLB scale is wrong but approved anyway.
- Audio candidate replaces semantic cue before approval.
- Review-only screenshot gets copied into public assets.
- Asset manifest contains absolute or raw path.
- Large model passes import but breaks browser budget.

## Deployment Issues To Hunt

- GitHub Pages may publish any file under public if promotion gates are bypassed.
- Build artifacts can accidentally copy reports or source candidates.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Keep asset approval as a blocking gate, not a documentation preference.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

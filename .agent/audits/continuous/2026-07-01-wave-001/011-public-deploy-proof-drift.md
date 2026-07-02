# Public deploy proof drift

Status: open
Audit wave: 2026-07-01-wave-001
Severity: critical
Domain: release/validation
Owning kit or workspace: n:runtime:validation plus n:goldrush:reality-status
Roadmap rows informed: 003, 010, 092, 095, 099, 100

## Problem

Local proof, Build branch proof, and public Pages proof can describe different code states if deploys, smoke tests, and reports are not tied to branch and timestamp.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- Every public claim includes branch, commit, workflow result, URL, and public smoke or live-state audit.
- Local proof and public proof are stored separately.
- Build artifacts pass public artifact sanitizer.

## Edge Cases To Hunt

- Build branch is green but default branch docs describe newer behavior.
- Pages cache serves stale JS after a deploy.
- Smoke proof uses localhost but is summarized as public.
- Workflow passes build but not natural player route.
- Report references source path or account data.

## Deployment Issues To Hunt

- Pages is static and may lag CI completion.
- Browser cache and base path issues can appear only on public URL.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Separate local, Build, and public truth in every release note.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

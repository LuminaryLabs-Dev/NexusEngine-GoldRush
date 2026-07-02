# Audio, atmosphere, and feedback gap

Status: open
Audit wave: 2026-07-01-wave-001
Severity: medium
Domain: audio/presentation/gameplay
Owning kit or workspace: n:audio:cue-state plus n:goldrush:music-and-stingers
Roadmap rows informed: 043, 044, 048, 056, 060, 061, 071, 076, 096

## Problem

The current audio fallback policy is safe, but the game will plateau emotionally if mining, cargo, train, threat, cashout, and final pressure are not reinforced by distinct cues and atmosphere.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- Each major game phase has a semantic cue and fallback pattern.
- Approved audio replaces fallback without changing gameplay ownership.
- Sound supports extraction risk and threat readability, not just ambiance.

## Edge Cases To Hunt

- Sustained hum returns and masks feedback.
- Train cue state is lost when scene becomes results.
- Threat audio fires without visible threat.
- Cashout progress has visual proof but no audible tension.
- Multiple loops overlap after scene reset.

## Deployment Issues To Hunt

- Autoplay and user gesture rules differ by browser.
- Public proof may need interaction before audio context resumes.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Treat audio as gameplay feedback once approval paths are ready, not decoration.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

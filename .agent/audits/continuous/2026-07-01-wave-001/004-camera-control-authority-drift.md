# Camera and control authority drift

Status: open
Audit wave: 2026-07-01-wave-001
Severity: critical
Domain: control/camera
Owning kit or workspace: n:control:third-person-camera plus n:goldrush:exploration-camera
Roadmap rows informed: 050, 051, 052, 053, 081, 089

## Problem

The earlier pulsing/back-and-forth symptom can return if transitions, proofs, player-follow, scenario helpers, or combat mode all write camera/player transform in the same frame.

## Source Lens

- GitHub game engines collection: https://github.com/collections/game-engines -- Missing-surface checklist for rendering, physics, tooling, resources, networking, scripting, deployment, and validation without turning GoldRush into an engine.
- Apex Legends official page: https://www.ea.com/games/apex-legends/apex-legends -- Scale and presentation benchmark for 60-player battle royale, massive maps, character identity, and evolving modes.
- PUBG Blue Zone revamp dev letter: https://pubg.com/en-asia/news/10280 -- Pacing benchmark for zone systems that shape movement, risk, combat timing, survivor count, and strategic choice.
- Hunt: Showdown official game page: https://www.huntshowdown.com/game -- Extraction benchmark for bounty value, sound, atmosphere, PvPvE pressure, and the decision to risk more or leave.

## Evidence Needed

- One authority owns runtime camera pose after each scene transition.
- WASD movement follows mouse-look yaw in loading-yard and run scenes.
- Motion video and sampled state prove camera pose does not alternate between two systems.

## Edge Cases To Hunt

- Transition reconfig keeps applying after gameplay starts.
- Proof helper sets player position while camera-follow also smooths from old target.
- Combat camera overrides exploration camera without resetting shoulder offset.
- Mouse-lock loss changes yaw but not movement basis.
- Character rig rotation and camera yaw disagree.

## Deployment Issues To Hunt

- Browser focus and pointer lock differ between local and public Pages.
- Video proof may be needed because screenshots miss oscillation.

## Cross-Domain Checks

- Does this risk cross terrain, collider, renderer, controls, gameplay, network, asset, or deploy ownership?
- Does the current proof exercise the natural player path or a helper path?
- Does the current report distinguish local, Build branch, public Pages, simulator, and staged single-player proof?
- Does the packet need a new local kit later, or can an existing domain kit own it cleanly?
- Does the finding require video, screenshots, simulator output, CLI validation, or all of them?

## Next Action

Keep camera state reset/reconfigure explicit at scene transitions and test with motion sampling.

## Completion Rule

This audit remains open until the evidence above is proven against current files, current commands, and current player-view or public proof. Documentation alone is not completion.

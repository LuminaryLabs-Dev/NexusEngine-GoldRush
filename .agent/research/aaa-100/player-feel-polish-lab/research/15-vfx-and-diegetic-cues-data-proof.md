# VFX And Diegetic Cues - Data Proof

Status: planned docs-only
Axis: 15
Source: GitHub game engine collection
URL: https://github.com/collections/game-engines

## Data And Proof

- Data seed: cue id, cue type, world position, priority, target id, visibility band, fade state, occlusion state, action hint..
- Event seed: cue.spawned, cue.updated, cue.resolved, cue.hidden, cue.conflict.detected.
- Validator target: Screenshot proof verifies one primary cue, limited secondary cues, no clutter flood, and no debug-only dependency..
- Human-view proof: Capture route arrow, mine cue, hold cue, cargo cue, threat cue, cover cue, cashout cue, result cue, and no-cue idle state..
- Public proof must re-run after Build branch deploys.

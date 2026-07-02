# Terrain Footing Grounding Feel - Data Proof

Status: planned docs-only
Axis: 04
Source: GitHub JavaScript game engine collection
URL: https://github.com/collections/javascript-game-engines

## Data And Proof

- Data seed: ground hit, visible height, collider height, normal, slope, step delta, grounding confidence, mismatch..
- Event seed: ground.hit.updated, ground.mismatch.detected, ground.step.applied, ground.slope.blocked.
- Validator target: Sampled movement proves visible terrain and collision terrain match within tolerance across near-play routes..
- Human-view proof: Walk across flat ground, ridge foot, wash, ramp, seam, gold zone, cashout zone, and mountain blocker edge..
- Public proof must re-run after Build branch deploys.

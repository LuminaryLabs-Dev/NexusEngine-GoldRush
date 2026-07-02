# Locomotion Animation Blend - Data Proof

Status: planned docs-only
Axis: 06
Source: PUBG official game overview
URL: https://pubg.com/en/game-info/overview

## Data And Proof

- Data seed: animation state, blend weights, speed scalar, direction scalar, cargo posture, action overlay, foot phase..
- Event seed: animation.state.changed, animation.blend.updated, animation.overlay.started, animation.footstep.cued.
- Validator target: Motion proof verifies no moonwalk, frozen legs, missing knees, or cargo posture drift..
- Human-view proof: Video walk/stop/start/strafe/carry/mine/cashout and compare character velocity to visible foot/body motion..
- Public proof must re-run after Build branch deploys.

# WASD Locomotion Feel - Data Proof

Status: planned docs-only
Axis: 03
Source: GitHub game engine collection
URL: https://github.com/collections/game-engines

## Data And Proof

- Data seed: input vector, camera yaw, desired velocity, actual velocity, acceleration, friction, grounded state, slope limit..
- Event seed: movement.input.sampled, movement.velocity.changed, movement.grounded.changed, movement.slope.rejected.
- Validator target: Input replay proves W follows camera yaw and diagonal movement clamps to intended speed..
- Human-view proof: Record figure-eight walking, forward camera turn, diagonal strafe, stop, slope climb, and blocked mountain attempt..
- Public proof must re-run after Build branch deploys.

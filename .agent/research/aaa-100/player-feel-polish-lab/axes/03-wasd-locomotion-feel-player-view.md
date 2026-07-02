# WASD Locomotion Feel - Player View

Status: planned docs-only
Axis: 03
Domain: control/movement

## Player Need

Pressing W should move where the camera faces, and strafe/backpedal should be readable from body motion.

## Acceptance

- The player can tell what changed without opening debug state.
- The player can tell what to do next.
- The cue works from the over-the-shoulder camera.
- The cue survives scene transition or clearly resets during transition.
- The cue does not crowd out higher-priority world information.

## Proof

Record figure-eight walking, forward camera turn, diagonal strafe, stop, slope climb, and blocked mountain attempt.

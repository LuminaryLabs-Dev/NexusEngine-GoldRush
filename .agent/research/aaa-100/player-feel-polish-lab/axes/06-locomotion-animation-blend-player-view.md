# Locomotion Animation Blend - Player View

Status: planned docs-only
Axis: 06
Domain: animation/control

## Player Need

The character should visibly react to input direction, speed, carried load, slopes, and action state.

## Acceptance

- The player can tell what changed without opening debug state.
- The player can tell what to do next.
- The cue works from the over-the-shoulder camera.
- The cue survives scene transition or clearly resets during transition.
- The cue does not crowd out higher-priority world information.

## Proof

Video walk/stop/start/strafe/carry/mine/cashout and compare character velocity to visible foot/body motion.

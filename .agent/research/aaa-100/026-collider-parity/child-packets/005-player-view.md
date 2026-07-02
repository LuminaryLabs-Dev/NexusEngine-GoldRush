# 026 Collider parity - Player View

Status: active
Domain: physics

## Player-View Target
The player never floats, sinks, clips, pulses, or stands on invisible terrain when walking over the authored map.

## Required Screenshot States
- Initial approach view.
- Movement view with the player moving toward the objective.
- Look-left/right view to prove orientation cues remain readable.
- Failure view showing how the state reads when blocked, contested, or incomplete.

## Readability Checks
- Foreground separates from ground.
- Midground route or cover cue is visible.
- Objective/reward/risk cue is visible.
- Debug overlays are not required to understand the next action.

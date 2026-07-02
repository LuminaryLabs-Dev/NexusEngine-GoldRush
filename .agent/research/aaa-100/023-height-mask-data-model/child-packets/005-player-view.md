# 023 Height/mask data model - Player View

Status: active
Domain: world

## Player-View Target
Visible terrain, player footing, object placement, and destination cues should agree from the player camera.

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

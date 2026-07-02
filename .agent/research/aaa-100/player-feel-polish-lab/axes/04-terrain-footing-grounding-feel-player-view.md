# Terrain Footing Grounding Feel - Player View

Status: planned docs-only
Axis: 04
Domain: world/physics/control

## Player Need

The character should not float, sink, hover on invisible surfaces, or slide across mountains that read as solid.

## Acceptance

- The player can tell what changed without opening debug state.
- The player can tell what to do next.
- The cue works from the over-the-shoulder camera.
- The cue survives scene transition or clearly resets during transition.
- The cue does not crowd out higher-priority world information.

## Proof

Walk across flat ground, ridge foot, wash, ramp, seam, gold zone, cashout zone, and mountain blocker edge.

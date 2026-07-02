# Camera Authority Stability - Player View

Status: planned docs-only
Axis: 02
Domain: runtime/control

## Player Need

The player should never feel the view being pulled backward, snapped sideways, or reset by hidden transition logic.

## Acceptance

- The player can tell what changed without opening debug state.
- The player can tell what to do next.
- The cue works from the over-the-shoulder camera.
- The cue survives scene transition or clearly resets during transition.
- The cue does not crowd out higher-priority world information.

## Proof

Compare video frame deltas during title, lobby, loading-yard, train lock, gold-field, combat, and results transitions.

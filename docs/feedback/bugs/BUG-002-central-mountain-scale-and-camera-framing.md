# BUG-002 Central Mountain Scale And Camera Framing

Status: open.

The central mountain should be a readable midground obstacle with visible walkaround routes, not a dark slab over the player view.

## Acceptance

- Spawn view shows sky, horizon, route floor, and at least one route cue.
- Approach view still reads the mountain as terrain, not a ceiling.
- Left and right detour routes are walkable.
- The collider still blocks direct traversal through the mountain core.

## Current Proof

- `.agent/feedback/BUG-002-central-mountain-scale-and-camera-framing.md`
- `tools/validation/validate-goldrush-mountain-readability.mjs`
- `screenshots/bug-002-mountain-readability.png`

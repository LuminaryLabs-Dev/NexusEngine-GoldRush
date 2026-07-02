# Character Rig Body Readability - Failure Modes

Status: planned docs-only
Axis: 05
Domain: character/render

## Main Fakeout

A 3D model can be technically loaded but still unreadable from the over-shoulder camera.

## Edge Cases

- scene transition interrupts the behavior.
- player changes input or mode mid-action.
- public build is stale.
- local proof passes but human-view capture is unclear.
- performance optimization removes the cue.
- two kits claim ownership of the same state.

## Hardening

- add one authoritative owner.
- emit clear events.
- expose a compact snapshot.
- prove local and public behavior.
- keep player-facing cue aligned with data receipt.

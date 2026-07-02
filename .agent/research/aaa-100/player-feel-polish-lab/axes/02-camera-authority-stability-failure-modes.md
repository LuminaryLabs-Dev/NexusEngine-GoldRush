# Camera Authority Stability - Failure Modes

Status: planned docs-only
Axis: 02
Domain: runtime/control

## Main Fakeout

A nonblank canvas and valid camera object do not prove the camera is comfortable or conflict-free.

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

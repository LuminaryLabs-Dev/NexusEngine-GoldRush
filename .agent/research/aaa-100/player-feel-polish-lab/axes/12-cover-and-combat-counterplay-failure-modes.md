# Cover And Combat Counterplay - Failure Modes

Status: planned docs-only
Axis: 12
Domain: combat/world/physics

## Main Fakeout

A cover marker is not counterplay if the threat can still hit through it or the player cannot reach it naturally.

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

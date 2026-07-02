# Cashout Tension Feedback - Failure Modes

Status: planned docs-only
Axis: 10
Domain: gameplay/extraction/audio/vfx

## Main Fakeout

Results proof can pass even if the player never performed a visible cashout action.

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

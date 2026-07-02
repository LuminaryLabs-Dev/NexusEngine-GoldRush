# Audio Cue Layering - Failure Modes

Status: planned docs-only
Axis: 14
Domain: audio/runtime

## Main Fakeout

Playing any sound is not enough; wrong looping, hum, overlap, or missing event timing can reduce readability.

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

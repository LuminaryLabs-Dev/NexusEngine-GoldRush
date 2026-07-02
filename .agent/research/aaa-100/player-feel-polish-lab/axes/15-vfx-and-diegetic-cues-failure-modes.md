# VFX And Diegetic Cues - Failure Modes

Status: planned docs-only
Axis: 15
Domain: render/gameplay/audio

## Main Fakeout

Many rings, arrows, and labels can be technically helpful while making the scene look like a prototype.

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

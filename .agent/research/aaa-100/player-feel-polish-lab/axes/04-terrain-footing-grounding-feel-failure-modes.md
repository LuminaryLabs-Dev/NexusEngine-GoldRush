# Terrain Footing Grounding Feel - Failure Modes

Status: planned docs-only
Axis: 04
Domain: world/physics/control

## Main Fakeout

A zero mismatch at spawn does not prove slopes, seams, LOD bands, or route surfaces are reliable.

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

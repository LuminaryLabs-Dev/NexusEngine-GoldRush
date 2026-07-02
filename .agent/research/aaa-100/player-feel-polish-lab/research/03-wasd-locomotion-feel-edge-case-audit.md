# WASD Locomotion Feel - Edge Case Audit

Status: planned docs-only
Axis: 03
Source: GitHub game engine collection
URL: https://github.com/collections/game-engines

## Edge Case Audit

- Fakeout: A character position changing over time does not prove movement is responsive, camera-relative, or controllable.
- If the proof only checks state, add a player-view capture.
- If the proof only checks local, add public capture.
- If the behavior crosses a scene transition, require reset/reconfigure proof.
- If a new feature makes the existing kit hard to reason about, split a narrow local GoldRush kit.

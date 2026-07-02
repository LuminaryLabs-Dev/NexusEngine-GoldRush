# Cover And Combat Counterplay - Edge Case Audit

Status: planned docs-only
Axis: 12
Source: GitHub JavaScript game engine collection
URL: https://github.com/collections/javascript-game-engines

## Edge Case Audit

- Fakeout: A cover marker is not counterplay if the threat can still hit through it or the player cannot reach it naturally.
- If the proof only checks state, add a player-view capture.
- If the proof only checks local, add public capture.
- If the behavior crosses a scene transition, require reset/reconfigure proof.
- If a new feature makes the existing kit hard to reason about, split a narrow local GoldRush kit.

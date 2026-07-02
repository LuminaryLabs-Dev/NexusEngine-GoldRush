# Threat Telegraph Readability - Edge Case Audit

Status: planned docs-only
Axis: 11
Source: GitHub game engine collection
URL: https://github.com/collections/game-engines

## Edge Case Audit

- Fakeout: A combat receipt after damage does not prove combat was readable or fair.
- If the proof only checks state, add a player-view capture.
- If the proof only checks local, add public capture.
- If the behavior crosses a scene transition, require reset/reconfigure proof.
- If a new feature makes the existing kit hard to reason about, split a narrow local GoldRush kit.

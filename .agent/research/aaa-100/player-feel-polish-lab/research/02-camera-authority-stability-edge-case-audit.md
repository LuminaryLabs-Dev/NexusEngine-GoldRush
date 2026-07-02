# Camera Authority Stability - Edge Case Audit

Status: planned docs-only
Axis: 02
Source: PUBG official game overview
URL: https://pubg.com/en/game-info/overview

## Edge Case Audit

- Fakeout: A nonblank canvas and valid camera object do not prove the camera is comfortable or conflict-free.
- If the proof only checks state, add a player-view capture.
- If the proof only checks local, add public capture.
- If the behavior crosses a scene transition, require reset/reconfigure proof.
- If a new feature makes the existing kit hard to reason about, split a narrow local GoldRush kit.

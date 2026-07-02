# Cashout Tension Feedback - Edge Case Audit

Status: planned docs-only
Axis: 10
Source: PUBG official game overview
URL: https://pubg.com/en/game-info/overview

## Edge Case Audit

- Fakeout: Results proof can pass even if the player never performed a visible cashout action.
- If the proof only checks state, add a player-view capture.
- If the proof only checks local, add public capture.
- If the behavior crosses a scene transition, require reset/reconfigure proof.
- If a new feature makes the existing kit hard to reason about, split a narrow local GoldRush kit.

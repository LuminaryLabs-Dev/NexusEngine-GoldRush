# Audio Cue Layering - Data Proof

Status: planned docs-only
Axis: 14
Source: PUBG official game overview
URL: https://pubg.com/en/game-info/overview

## Data And Proof

- Data seed: active cue, layer, priority, loop state, cooldown, scene phase, semantic role, fallback pattern, approved asset status..
- Event seed: audio.cue.started, audio.cue.stopped, audio.layer.changed, audio.asset.pending, audio.fallback.used.
- Validator target: Proof verifies distinct semantic cues fire once per event and approved assets remain gated until promotion..
- Human-view proof: Capture title, lobby, train arrival, door, board, depart, mine, cargo, threat, cashout, result, and mute/restart behavior..
- Public proof must re-run after Build branch deploys.

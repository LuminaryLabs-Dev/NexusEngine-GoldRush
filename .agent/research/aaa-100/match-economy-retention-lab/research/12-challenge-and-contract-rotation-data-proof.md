# Challenge And Contract Rotation - Data Proof

Status: planned docs-only
System: 12
Source: GitHub JavaScript game engine collection
URL: https://github.com/collections/javascript-game-engines

## Data And Proof

- Data seed: challenge id, rotation id, objective, eligibility, reward, expiration, mode scope, anti-grind cap.
- Event seed: challenge.rotation.loaded, challenge.progressed, challenge.completed, challenge.expired.
- Validator target: Rotation validator proves deterministic challenge sets, no expired challenge rewards, and no debug-only objectives..
- Human-view proof: Lobby or results can show one optional claim challenge without crowding hero controls..
- Public proof must include the economy/progression ruleset id when the behavior is deploy-facing.

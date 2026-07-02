# Bot AI Fakeout Register

Status: active

| Fakeout | Why it is dangerous | Required guard |
| --- | --- | --- |
| Bot count equals multiplayer proof | It overclaims scale. | Report proof tier and human/bot counts. |
| Bots teleport to objectives | It skips terrain and route proof. | Movement must consume route and terrain APIs. |
| Bots mine by receipt only | It skips resource readability. | Require visible mine action and cargo state. |
| Combat damage before telegraph | It feels unfair. | Damage gate requires cue window. |
| Cashout bot completes silently | It hides extraction stakes. | Cashout must show contest cue and receipt. |
| Difficulty only changes damage | It feels cheap. | Difficulty changes timing, route, cover, and aggression. |
| Renderer owns behavior | It bypasses domain kits. | Behavior state must come from kit snapshots. |
| Public proof omits labels | It misleads release planning. | Public reports must include proof label and mode id. |

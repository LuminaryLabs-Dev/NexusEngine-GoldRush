# Kit Gap Register

Status: active docs-only

## Purpose

Track likely local kits or adapters needed when implementation resumes.

## Gaps

| Slice | Likely missing or thin local kit | Why it matters |
| --- | --- | --- |
| Runtime Domain Registry | n:goldrush:runtime | Make every game system discoverable, ordered, resettable, snapshot-capable, and owned by one domain. |
| Scene Site Loader And Flow | n:goldrush:scene-flow | Load different kit groups per scene site so title, lobby, train, run, and results do not share accidental hidden state. |
| Title Audio Entry | n:goldrush:music-and-stingers | Start the game with GoldRush identity, safe audio cues, settings affordance, and a clear first action. |
| Lobby Party Character Preview | n:goldrush:party-lobby plus n:goldrush:prospector-preview | Let a small squad form by code while seeing a real 3D character identity surface. |
| Group Selection Match Config | n:goldrush:party-lobby | Keep Crew, Posse, and Outfit as compact configuration instead of first-screen card clutter. |
| Train Loading Sequence | n:goldrush:train-loading | Make the train arrive, open, board, lock player, depart, and hand off to the run as one reliable sequence. |
| Train Boarding Party Sync | n:goldrush:party-boarding-sync | Gate train departure on real party readiness while preserving single-player staging speed. |
| Gold Field Spawn Map Source | n:goldrush:desert-world-map | Spawn the player into an authored desert source that owns height, masks, routes, landmarks, and gameplay zones. |
| Third Person Controller | n:goldrush:exploration-camera plus n:goldrush:prospector-movement | Make mouse-look and camera-relative WASD the only normal exploration control authority. |
| Terrain Grounding Physics | n:goldrush:terrain-physics plus n:goldrush:player-grounding | Keep player, props, colliders, raycasts, and visible terrain in one parity contract. |
| Resource Discovery Protokits | n:goldrush:desert-prop-kits plus n:goldrush:gold-seam-protokits | Turn gold nodes, seams, rocks, plants, mine props, and signs into placed object protokits instead of anonymous meshes. |
| Mining Hold Action | n:goldrush:mine-hold-action | Make mining a tactile hold action with cancel, progress, animation, audio, receipt, and cargo output. |
| Cargo Carry Risk | n:goldrush:gold-carrying | Make carried gold alter movement, character posture, visibility, threat pressure, and score potential. |
| Threat Ambush Pressure | n:goldrush:ambush-pressure | Make extracting gold create escalating danger that the player can read and respond to. |
| Cover Combat Route | n:goldrush:combat-route-guidance plus n:goldrush:cover-protokits | Give the player a natural route to cover and counterplay when an ambush starts. |
| Cashout Extraction Sites | n:goldrush:cashout-sites | Make extraction a visible, contested, timed, interruptible site interaction tied to world landmarks. |
| Scoring Results Replay | n:goldrush:extraction-receipts plus n:goldrush:gold-rush-scoring plus n:goldrush:results-screen | Convert mined, carried, contested, extracted, lost, and combat receipts into readable end-of-match payoff. |
| Bot Fill Single Player Staging | n:goldrush:bot-fill-staging | Let one local player test the full 60-player-intended loop with bots, dummy squads, and deterministic scenarios. |
| Sixty Player Room Scale | n:goldrush:room-orchestration | Define how 60 players, party starts, room partitions, snapshots, and public proof become testable without exposing shards as UX. |
| Deploy Proof Restart | n:goldrush:reality-status | Keep every major loop change tied to local proof, public proof, sanitized reports, changelog, and restart packet. |

## New Kit Rule

If an implementation pass finds a slice too broad or brittle, create a smaller GoldRush-local kit packet first. Do not bury the split inside renderer or app glue.


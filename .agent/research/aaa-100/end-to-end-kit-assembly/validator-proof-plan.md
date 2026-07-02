# Validator And Proof Plan

Status: active docs-only

## Purpose

Turn each assembly slice into a future validation target.

## Plan

| Slice | Validator seed | Human or public proof seed |
| --- | --- | --- |
| Runtime Domain Registry | `validate-domain-kit-contracts` | state snapshot shows every active kit with owner, dependencies, events, reset, and validation status |
| Scene Site Loader And Flow | `validate-scene-sites` | browser can move title to lobby to train to field to results with expected kit groups mounted |
| Title Audio Entry | `validate-audio-cue-approval-plan` | title screen plays approved or semantic fallback cue and exposes no sustained hum or hidden debug dependency |
| Lobby Party Character Preview | `proof:peer-party-boarding plus character-preview proof` | host/member party state and draggable Three.js character preview are visible before launch |
| Group Selection Match Config | `validate-match-lifecycle` | selected group size affects match seed and allowed squad/match settings without taking over the main UX |
| Train Loading Sequence | `validate-first-sequence` | browser proof shows arrival, open door, board action, locked rider, departure, and field handoff |
| Train Boarding Party Sync | `proof:peer-party-boarding and proof:peer-party-disconnect` | two-browser party boards, disconnect policy releases remaining roster, and no stale peer blocks the train |
| Gold Field Spawn Map Source | `validate-terrain-heightfield plus authored fixture validator` | spawn position, terrain revision, walkable mask, and site intent are visible in state and browser proof |
| Third Person Controller | `validate-third-person-controller plus live-state audit` | camera pose remains single-authority and movement follows camera yaw over multiple frames |
| Terrain Grounding Physics | `validate-physics-colliders plus validate-terrain-continuity` | ground mismatch remains within budget across motion samples and visible mesh agrees with collider samples |
| Resource Discovery Protokits | `validate-render-instancing plus object-protokit validator` | mineable resource is visually distinct, terrain-grounded, selectable, and tied to one affordance id |
| Mining Hold Action | `validate-player-driven-extraction-route` | player approaches resource, starts hold, sees progress, can complete, and receives carried gold state |
| Cargo Carry Risk | `cargo-visual proof plus extraction-loop validator` | cargo appears on character, movement changes, threat/noise state changes, and receipts preserve carried amount |
| Threat Ambush Pressure | `validate-goldrush-extraction-loop plus combat-readiness proof` | threat telegraph changes after cargo and presents readable pressure before damage or interruption |
| Cover Combat Route | `proof:combat-route-guidance` | player carries cargo, pressure starts, cover route appears, movement reaches cover, and combat receipt records engagement |
| Cashout Extraction Sites | `proof:extraction-setpiece plus validate-goldrush-extraction-loop` | player reaches cashout set piece, sees prompt/progress/risk, completes or is interrupted, and emits receipt |
| Scoring Results Replay | `results-screen proof plus validate-match-results` | results screen shows score, extraction, pressure, contest, replay moments, and next actions without raw ids visible |
| Bot Fill Single Player Staging | `validate-staging-scenarios plus NexusSimulator suite` | single-player scenario can run full loop with bot pressure, receipt output, and no claim of live multiplayer proof |
| Sixty Player Room Scale | `network scale simulator plus memory/network budget validator` | simulated 60-player roster, partition state, snapshot budget, and handoff receipts stay bounded and inspectable |
| Deploy Proof Restart | `proof:live-state-audit plus validate-report-secrets` | local and public reports cover the changed slice and name the proof gap if the full end state remains incomplete |

## Proof Rule

A CLI validator can prove data shape and domain invariants. A player-facing slice also needs browser proof. A deployment-facing slice needs public proof.


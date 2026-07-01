# Peer Gated Train Handoff

Status: active
Date: 2026-06-30

## Domain

Train loading / party readiness / match handoff.

## Sources

- Unity Lobby service documentation: https://docs.unity.com/ugs/manual/lobby/manual/unity-lobby-service
- MDN WebRTC data channels: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels
- AWS GameLift FlexMatch documentation: https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-intro.html

## Research Takeaways

- Multiplayer lobbies should expose ready state before a game-session transition.
- Browser peer transport can fan out readiness, but the gameplay handoff still needs a deterministic local authority surface.
- Readiness gates need a visible/snapshot state because hidden async network state makes loading transitions unreliable.
- The launch handoff should separate "the local player boarded" from "the party is ready to depart."

## GoldRush Application

- `goldrush-train-boarding-v1` owns local train boarding and party-seat auto-follow.
- `goldrush-peer-party-boarding-sync-v1` owns PeerJS fanout of per-browser local boarding reports.
- `goldrush-peer-handoff-gate-v1` bridges the two: one-player local play can depart immediately, but multi-member parties require peer readiness before train departure starts.
- The local player locks to the train after local boarding, then the train waits in `boarding-syncing` until the peer gate becomes ready.

## Latest Proof

- Report: `output/playwright/peer-party-gated-handoff-proof/peer-party-boarding-2026-06-30T15-35-13-986Z.json`
- Host and member both reached `site.loading-yard`.
- Host and member both had `peerHandoffGate.required: true`.
- Host and member both had `peerHandoffGate.ready: true`, `readyCount: 2`, `expectedCount: 2`, and `missingMemberIds: []`.
- Train phase reached `train-departing` only after the ready peer gate.

## Remaining Gaps

- Late disconnects during `boarding-syncing` still need a timeout/kick/rehost policy.
- The visual scene should show a party-ready countdown or train conductor cue.
- The mass-match runtime still needs authoritative room synchronization after the train handoff.

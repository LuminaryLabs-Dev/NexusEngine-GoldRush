# Peer Disconnect Roster Policy

Status: active

## Question

How should GoldRush handle a party member who leaves or drops during loading-yard train boarding?

## External Anchors

- PeerJS documents data connections as evented peer-to-peer channels with connection lifecycle events, so GoldRush can listen for explicit data messages and close/error events but should not make game authority depend on PeerJS alone: https://peerjs.com/docs/
- WebRTC data channels expose open/message/error/close lifecycle behavior, but browser teardown timing can vary, so game readiness should tolerate late or missing close notifications: https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel
- Unity Lobby-style multiplayer services separate lobby membership/heartbeat from match gameplay authority; this supports keeping the party room as presence/launch orchestration rather than match authority: https://docs.unity.com/ugs/manual/lobby/manual/unity-lobby-service

## Decision

Use `reduce-roster-require-remaining` during loading-yard boarding:

- A connected party member is part of the active boarding roster.
- Each browser must report its own local train boarding status.
- Local auto-follow seats do not count as remote peer readiness.
- If a member sends `leave` or its PeerJS connection closes, remove it from the active roster.
- Keep a disconnect receipt with member id, reason, time, and policy.
- Ignore stale boarding reports from removed member ids.
- Force the remaining local client to republish its boarding status after roster reduction.
- Release `goldrush-peer-handoff-gate-v1` only when the remaining roster is ready.

## AAA Gap Framing

For an extraction battle royale, loading transitions need to fail forward. A player disconnecting during the train scene should not strand the whole party in a non-combat staging space. The correct player-facing behavior is:

- the remaining party keeps agency,
- the departure continues once the reduced roster is ready,
- the system records the drop for replay/debug,
- match authority remains in NexusRealtime/GoldRush receipts rather than PeerJS transport.

## Kit Implications

- `n:network:party-room` exposes generic roster reduction and disconnect policy.
- `n:goldrush:party-lobby` owns GoldRush-specific leave, member disconnect receipts, and boarding sync fanout.
- `n:goldrush:train-loading` consumes the reduced roster through `goldrush-peer-handoff-gate-v1`.
- Proof must cover all-ready and reduced-roster paths.

## Validator And Proof

- `node tools/validation/validate-peer-party-boarding.mjs`
- `node tools/validation/validate-first-sequence.mjs`
- `npm run proof:peer-party-boarding`
- `npm run proof:peer-party-disconnect`

Latest local disconnect proof:

```txt
output/playwright/peer-party-disconnect-proof/peer-party-boarding-2026-06-30T15-57-04-607Z.json
```

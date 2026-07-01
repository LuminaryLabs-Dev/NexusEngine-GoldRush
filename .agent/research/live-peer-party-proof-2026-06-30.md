# Live Peer Party Proof

Status: active
Date: 2026-06-30

## Domain

Network party room / browser proof / train loading readiness.

## Sources

- PeerJS documentation: https://peerjs.com/docs/
- MDN WebRTC data channels: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels
- Unity Lobby service documentation: https://docs.unity.com/ugs/manual/lobby/manual/unity-lobby-service

## Research Takeaways

- Peer/browser multiplayer proof must validate message flow in a real browser, not only pure helper functions.
- WebRTC-style data channels are suitable for small party-state fanout, but not for authoritative match simulation by themselves.
- Lobby readiness should be explicit, serializable, and visible to all clients before the game-session handoff.
- A party launch proof should verify both sides agree on room code, member count, readiness count, and scene handoff phase.

## GoldRush Application

- `npm run proof:peer-party-boarding` creates two isolated browser contexts.
- The host creates a PeerJS room code.
- The member joins by code.
- The leader launches the loading yard.
- Both clients move to the train-door proof position.
- Both clients report local boarding.
- Both clients receive `goldrush-peer-party-boarding-sync-v1` with `readyCount: 2` and `allReady: true`.

## Latest Proof

- Report: `output/playwright/peer-party-boarding-proof/peer-party-boarding-2026-06-30T15-28-24-066Z.json`
- Host: `loading`, `site.loading-yard`, `2` party members, `2/2` ready.
- Member: `loading`, `site.loading-yard`, `2` party members, `2/2` ready.

## Remaining Gaps

- This proves party readiness fanout, not authoritative mass-match networking.
- The train handoff still allows local first-sequence departure before peer readiness is used as a hard blocker.
- Late disconnect handling during the loading yard still needs policy.

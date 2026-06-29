# Network Kit

Status: resolved

## Purpose

Make `engine.n.goldrushNetwork` the stable multiplayer contract. Internal 50-player partitions exist only behind this kit and should not drive the primary UI.

## Work Items

- Public API: `engine.n.goldrushNetwork`.
- Compatibility facade: `engine.n.goldrushRooms`.
- Internal invariant: 2-100 simulated players, 50-player partitions.
- Incremental allocator: `createNetworkOrchestrator().createSession()`.
- Live-session invariant: player 51 creates partition 2; dropping below 51 retains partition 2 until match end.
- Edge cases: duplicate joins reject, player 101 rejects, early player leaves compact active roster assignments toward partition 1 without deleting retained partition ids.
- Player joining UI: deferred; multi-browser testing is handled outside the first-screen UX.
- Resolution proof: `node tools/validation/validate-network-kit.mjs`, `node tools/validation/validate-room-orchestration.mjs`, and `node tools/validation/validate-nexus-runtime.mjs`.

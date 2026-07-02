# Live Network Authority Lab

Status: active

## Purpose

This docs-only lab defines the live-network authority, replication, transport, partition, recovery, fairness, and proof systems needed before GoldRush can honestly move from local/simulated proof toward live 60-player play.

## Why This Exists

GoldRush has party-code proof, simulated topology, route/combat readiness, bot staging plans, and public Pages smoke proof. That is not the same as a live 60-player battle royale. The missing surface is a network contract that explains who has authority, what gets replicated, how PeerJS/WebRTC is wrapped, how partitions hand off state, how latency is tested, and what a public proof is allowed to claim.

## Boundary

- This folder is planning and audit only.
- Do not implement networking here.
- Do not claim live 60-player readiness from local browser tabs, bots, simulator runs, or public smoke.
- PeerJS is a transport adapter, not gameplay authority.
- NexusRealtime-style kits own modes, authority, snapshots, receipts, and proof labels.

## System Matrix

| # | System | Generic kit | GoldRush kit | Research |
| --- | --- | --- | --- | --- |
| 01 | [Network Mode Policy](systems/network-mode-policy/README.md) | `n:network:mode-policy` | `n:goldrush:network-mode-policy` | [research](research/network-mode-policy/01-source-research.md) |
| 02 | [Party To Match Handoff](systems/party-to-match-handoff/README.md) | `n:network:party-match-handoff` | `n:goldrush:party-to-match-handoff` | [research](research/party-to-match-handoff/01-source-research.md) |
| 03 | [Live Room Authority](systems/live-room-authority/README.md) | `n:network:room-authority` | `n:goldrush:live-room-authority` | [research](research/live-room-authority/01-source-research.md) |
| 04 | [Host Election And Migration](systems/host-election-and-migration/README.md) | `n:network:host-election` | `n:goldrush:host-election-migration` | [research](research/host-election-and-migration/01-source-research.md) |
| 05 | [Peer Transport Adapter](systems/peer-transport-adapter/README.md) | `n:network:peer-transport` | `n:goldrush:peer-transport-adapter` | [research](research/peer-transport-adapter/01-source-research.md) |
| 06 | [Signaling And ICE Readiness](systems/signaling-and-ice-readiness/README.md) | `n:network:connection-readiness` | `n:goldrush:signaling-ice-readiness` | [research](research/signaling-and-ice-readiness/01-source-research.md) |
| 07 | [Interest Management Regions](systems/interest-management-regions/README.md) | `n:network:interest-management` | `n:goldrush:interest-management-regions` | [research](research/interest-management-regions/01-source-research.md) |
| 08 | [Replication Snapshot Contract](systems/replication-snapshot-contract/README.md) | `n:network:replication-snapshot` | `n:goldrush:replication-snapshot-contract` | [research](research/replication-snapshot-contract/01-source-research.md) |
| 09 | [Delta Compression And Priority](systems/delta-compression-and-priority/README.md) | `n:network:delta-priority` | `n:goldrush:delta-compression-priority` | [research](research/delta-compression-and-priority/01-source-research.md) |
| 10 | [Input Command Buffer](systems/input-command-buffer/README.md) | `n:network:input-buffer` | `n:goldrush:input-command-buffer` | [research](research/input-command-buffer/01-source-research.md) |
| 11 | [Prediction Reconciliation](systems/prediction-reconciliation/README.md) | `n:network:prediction-reconciliation` | `n:goldrush:prediction-reconciliation` | [research](research/prediction-reconciliation/01-source-research.md) |
| 12 | [Authoritative Receipt Ledger](systems/authoritative-receipt-ledger/README.md) | `n:network:receipt-ledger` | `n:goldrush:authoritative-receipt-ledger` | [research](research/authoritative-receipt-ledger/01-source-research.md) |
| 13 | [Partition Handoff And Cross Room Events](systems/partition-handoff-and-cross-room-events/README.md) | `n:network:partition-handoff` | `n:goldrush:partition-handoff-events` | [research](research/partition-handoff-and-cross-room-events/01-source-research.md) |
| 14 | [Disconnect Rejoin Recovery](systems/disconnect-rejoin-recovery/README.md) | `n:network:reconnect-recovery` | `n:goldrush:disconnect-rejoin-recovery` | [research](research/disconnect-rejoin-recovery/01-source-research.md) |
| 15 | [Latency Jitter Loss Simulator](systems/latency-jitter-loss-simulator/README.md) | `n:network:chaos-simulator` | `n:goldrush:latency-jitter-loss-simulator` | [research](research/latency-jitter-loss-simulator/01-source-research.md) |
| 16 | [Fairness Sanity Abuse Boundary](systems/fairness-sanity-abuse-boundary/README.md) | `n:network:sanity-boundary` | `n:goldrush:fairness-sanity-abuse-boundary` | [research](research/fairness-sanity-abuse-boundary/01-source-research.md) |
| 17 | [Live Proof Harness](systems/live-proof-harness/README.md) | `n:network:live-proof` | `n:goldrush:live-proof-harness` | [research](research/live-proof-harness/01-source-research.md) |
| 18 | [Public Deploy Network Readiness](systems/public-deploy-network-readiness/README.md) | `n:network:deploy-readiness` | `n:goldrush:public-deploy-network-readiness` | [research](research/public-deploy-network-readiness/01-source-research.md) |

## External Reference Signals

| Source | Reference | Signal | GoldRush implication |
| --- | --- | --- | --- |
| peerjs-home | [PeerJS overview](https://peerjs.com/) | PeerJS wraps WebRTC with an event-driven P2P API, supports serializable data transfer, and allows ICE/server configuration. | PeerJS can remain the browser transport adapter, but GoldRush still needs authority, replication, interest, and proof contracts above it. |
| peerjs-getting-started | [PeerJS data connections](https://peerjs.com/client/getting-started) | PeerJS data connections start with peer IDs, peer.connect, connection events, and send/receive DataConnection objects. | Party codes, peer IDs, connect/open/data/error/close events, and handoff receipts need first-class kit ownership. |
| mdn-data-channels | [MDN WebRTC data channels](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels) | RTCDataChannel exchanges arbitrary data over peer connections, has buffering/message-size concerns, and is encrypted by WebRTC components. | Replication messages need bounded size, buffer/backpressure policy, and protocol channels rather than unbounded JSON spam. |
| webrtc-peer-connections | [WebRTC peer connections](https://webrtc.org/getting-started/peer-connections) | Peer connections need ICE server configuration and signaling to exchange connection information. | Live proof needs explicit signaling, ICE/STUN/TURN readiness, connection diagnostics, and failure labels. |
| ietf-rfc8831 | [RFC 8831 WebRTC data channels](https://datatracker.ietf.org/doc/html/rfc8831) | WebRTC data channels carry non-media data over SCTP in the WebRTC context. | GoldRush protocol planning should distinguish ordered receipts from lower-priority state updates and should avoid one undifferentiated stream. |
| apex-modes | [Apex Legends game modes](https://help.ea.com/en/articles/apex-legends/game-modes/) | Private Match supports up to 60 players and Bot Royale separates progression/stat rules from other modes. | GoldRush should separate future live private matches, bot-filled staging, public proof, progression eligibility, and stat eligibility. |

## Required End State

A future live network proof can only claim 60-player readiness when it proves real peer count, authority, ordered receipts, bounded replication, connection readiness, partition handoff, disconnect/rejoin behavior, latency tolerance, sanity boundaries, and public deploy readiness. Until then, runs must be labeled as local, public smoke, bot staging, simulator, same-machine peer, or future live.

## First Coding Batch Later

1. Add network mode policy and proof labels.
2. Wrap current PeerJS party transport behind a generic transport adapter contract.
3. Add authoritative receipt ordering for mine, damage, cargo, cashout, and score.
4. Add replication snapshot schema and size budget validator.
5. Add interest-management fixture for 20 and 60 simulated actors.
6. Add chaos simulator proof for latency, jitter, loss, and disconnect.

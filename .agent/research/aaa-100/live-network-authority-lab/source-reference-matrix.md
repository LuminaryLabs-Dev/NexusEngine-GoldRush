# Source Reference Matrix

Status: active

| Source | URL | Relevant signal | GoldRush use |
| --- | --- | --- | --- |
| peerjs-home | [PeerJS overview](https://peerjs.com/) | PeerJS wraps WebRTC with an event-driven P2P API, supports serializable data transfer, and allows ICE/server configuration. | PeerJS can remain the browser transport adapter, but GoldRush still needs authority, replication, interest, and proof contracts above it. |
| peerjs-getting-started | [PeerJS data connections](https://peerjs.com/client/getting-started) | PeerJS data connections start with peer IDs, peer.connect, connection events, and send/receive DataConnection objects. | Party codes, peer IDs, connect/open/data/error/close events, and handoff receipts need first-class kit ownership. |
| mdn-data-channels | [MDN WebRTC data channels](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels) | RTCDataChannel exchanges arbitrary data over peer connections, has buffering/message-size concerns, and is encrypted by WebRTC components. | Replication messages need bounded size, buffer/backpressure policy, and protocol channels rather than unbounded JSON spam. |
| webrtc-peer-connections | [WebRTC peer connections](https://webrtc.org/getting-started/peer-connections) | Peer connections need ICE server configuration and signaling to exchange connection information. | Live proof needs explicit signaling, ICE/STUN/TURN readiness, connection diagnostics, and failure labels. |
| ietf-rfc8831 | [RFC 8831 WebRTC data channels](https://datatracker.ietf.org/doc/html/rfc8831) | WebRTC data channels carry non-media data over SCTP in the WebRTC context. | GoldRush protocol planning should distinguish ordered receipts from lower-priority state updates and should avoid one undifferentiated stream. |
| apex-modes | [Apex Legends game modes](https://help.ea.com/en/articles/apex-legends/game-modes/) | Private Match supports up to 60 players and Bot Royale separates progression/stat rules from other modes. | GoldRush should separate future live private matches, bot-filled staging, public proof, progression eligibility, and stat eligibility. |

## Research Read

The references support a split between transport and game authority. PeerJS/WebRTC can connect peers and exchange data, but GoldRush still needs its own protocol, authority, replication, and proof boundaries. Apex's mode separation reinforces that private, bot, practice, and live modes need distinct eligibility and evidence labels.

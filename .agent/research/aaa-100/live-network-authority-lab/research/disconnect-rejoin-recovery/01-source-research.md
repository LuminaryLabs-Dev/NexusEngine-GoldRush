# Disconnect Rejoin Recovery Source Research

Status: planned

## Reference Signals

- PeerJS provides an event-driven wrapper over WebRTC peer connections and data transfer.
- PeerJS data connections rely on peer IDs, connection events, and DataConnection send/receive behavior.
- MDN WebRTC data channels highlight arbitrary data exchange plus buffering, message-size, and security considerations.
- WebRTC peer connections require ICE configuration and signaling outside the core WebRTC spec.
- RFC 8831 describes non-media WebRTC data over SCTP in the WebRTC context.
- Apex mode docs show 60-player private/bot contexts with mode-specific progression and stat rules.

## GoldRush Reading

Define what happens when party members, live players, or authority peers leave and return. The source implication is that this system must become a named network kit surface with data, events, snapshot, reset, validator, and proof labels.

## Links

- [PeerJS overview](https://peerjs.com/)
- [PeerJS data connections](https://peerjs.com/client/getting-started)
- [MDN WebRTC data channels](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels)
- [WebRTC peer connections](https://webrtc.org/getting-started/peer-connections)
- [RFC 8831 WebRTC data channels](https://datatracker.ietf.org/doc/html/rfc8831)
- [Apex Legends game modes](https://help.ea.com/en/articles/apex-legends/game-modes/)

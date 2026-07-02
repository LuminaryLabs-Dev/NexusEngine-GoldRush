# Peer Transport Adapter Data Proof

Status: planned

## Data Seed

- `peerId`
- `connectionState`
- `bufferedBytes`
- `lastPacketId`
- `errorCode`

## Event Seed

- `transport.peer.open`
- `transport.packet.sent`
- `transport.packet.received`
- `transport.peer.closed`

## Proof Seed

- Validator: `validate-peer-transport-adapter.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: PeerJS data connections are visible as transport snapshots without exposing PeerJS as gameplay authority.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

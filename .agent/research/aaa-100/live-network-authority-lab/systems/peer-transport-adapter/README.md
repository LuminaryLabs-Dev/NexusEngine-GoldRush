# 05 Peer Transport Adapter

Status: planned

## Purpose

Wrap PeerJS/WebRTC connection events behind a stable NexusRealtime-style transport contract.

## Player Need

Connection state should be reliable enough for party launch, live proof, and failure reporting.

## Owning Kits

- Generic incubator candidate: `n:network:peer-transport`
- GoldRush custom kit: `n:goldrush:peer-transport-adapter`

## Public API Seed

- `connectPeer(peerId)`
- `sendPacket(peerId, packet)`
- `getTransportSnapshot()`

## Internal API Seed

- `serializePacket(packet)`
- `routeConnectionEvent(event)`
- `trackBufferedAmount(conn)`

## Events

- `transport.peer.open`
- `transport.packet.sent`
- `transport.packet.received`
- `transport.peer.closed`

## Snapshot

- `peerId`
- `connectionState`
- `bufferedBytes`
- `lastPacketId`
- `errorCode`

## Validator

`validate-peer-transport-adapter.mjs`

## Player-View Proof

PeerJS data connections are visible as transport snapshots without exposing PeerJS as gameplay authority.

## Risk If Missing

If gameplay talks directly to PeerJS, transport errors leak into game rules and are hard to prove.

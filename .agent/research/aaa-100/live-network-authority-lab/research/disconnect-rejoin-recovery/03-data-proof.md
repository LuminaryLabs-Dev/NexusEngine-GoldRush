# Disconnect Rejoin Recovery Data Proof

Status: planned

## Data Seed

- `peerId`
- `recoveryState`
- `lockedCargo`
- `windowMs`
- `lastCheckpointId`

## Event Seed

- `peer.disconnected`
- `peer.rejoin.requested`
- `peer.rejoined`
- `peer.recovery.expired`

## Proof Seed

- Validator: `validate-disconnect-rejoin-recovery.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Disconnect tests show clear cargo/inventory lock, timeout, rejoin, or drop conversion policy.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

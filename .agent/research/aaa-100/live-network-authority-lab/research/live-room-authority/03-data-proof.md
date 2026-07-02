# Live Room Authority Data Proof

Status: planned

## Data Seed

- `authorityId`
- `epoch`
- `commandSequence`
- `lastDeltaId`
- `conflictPolicy`

## Event Seed

- `authority.elected`
- `authority.command.accepted`
- `authority.delta.published`

## Proof Seed

- Validator: `validate-live-room-authority.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Two clients submit conflicting mine or cashout actions and one authoritative receipt order wins deterministically.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

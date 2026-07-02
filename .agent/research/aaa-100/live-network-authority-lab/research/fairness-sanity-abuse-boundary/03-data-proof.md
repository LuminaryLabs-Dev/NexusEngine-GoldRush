# Fairness Sanity Abuse Boundary Data Proof

Status: planned

## Data Seed

- `peerId`
- `acceptedCount`
- `rejectedCount`
- `rateLimitState`
- `lastRejectReason`

## Event Seed

- `sanity.command.accepted`
- `sanity.command.rejected`
- `sanity.suspicion.reported`

## Proof Seed

- Validator: `validate-fairness-sanity-boundary.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Impossible speed, distance mining, duplicate cashout, and impossible damage commands are rejected with readable reasons.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

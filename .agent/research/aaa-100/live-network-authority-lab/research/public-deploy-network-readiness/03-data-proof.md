# Public Deploy Network Readiness Data Proof

Status: planned

## Data Seed

- `urlMode`
- `secureContext`
- `signalingReady`
- `iceReady`
- `blockedClaims`

## Event Seed

- `deploy.network.checked`
- `deploy.network.blocked`
- `deploy.network.ready`

## Proof Seed

- Validator: `validate-public-deploy-network-readiness.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Public proof states exactly which network modes are available on the deployed page and which live claims are blocked.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

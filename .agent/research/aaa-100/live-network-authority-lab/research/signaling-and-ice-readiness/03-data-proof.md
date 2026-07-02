# Signaling And ICE Readiness Data Proof

Status: planned

## Data Seed

- `signalingState`
- `iceState`
- `setupMs`
- `turnRequired`
- `failureLabel`

## Event Seed

- `connection.signaling.ready`
- `connection.ice.ready`
- `connection.failed`

## Proof Seed

- Validator: `validate-signaling-ice-readiness.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Proof reports show setup timing, failure labels, and whether the run had enough connectivity evidence.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

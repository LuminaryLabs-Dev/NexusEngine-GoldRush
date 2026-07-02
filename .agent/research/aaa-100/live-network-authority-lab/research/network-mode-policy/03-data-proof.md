# Network Mode Policy Data Proof

Status: planned

## Data Seed

- `modeId`
- `proofTier`
- `humanCount`
- `botCount`
- `liveEligible`
- `allowedClaims`

## Event Seed

- `network.mode.selected`
- `network.mode.claims.changed`
- `network.mode.overclaim.rejected`

## Proof Seed

- Validator: `validate-network-mode-policy.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Reports and UI label local, public, simulated, peer-party, and future live runs without ambiguity.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

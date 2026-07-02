# Local Public Bot Proof Boundary Data Proof

Status: planned

## Data Seed

- `proofType`
- `allowedClaims`
- `blockedClaims`
- `releaseGate`

## Event Seed

- `proof.boundary.classified`
- `proof.overclaim.rejected`
- `proof.release-gate.updated`

## Proof Seed

- Validator: `validate-local-public-bot-proof-boundary.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: A simulated 60-player bot run can pass as staging scale but cannot pass as live 60-player multiplayer.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

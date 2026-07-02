# Input Command Buffer Data Proof

Status: planned

## Data Seed

- `localSequence`
- `pendingCount`
- `lastAck`
- `oldestPendingMs`
- `commandTypes`

## Event Seed

- `input.command.recorded`
- `input.command.submitted`
- `input.command.expired`

## Proof Seed

- Validator: `validate-input-command-buffer.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Repeated interact/fire/movement inputs create ordered commands and do not duplicate cashout or damage receipts.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

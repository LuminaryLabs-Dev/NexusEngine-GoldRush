# Party To Match Handoff Data Proof

Status: planned

## Data Seed

- `partyCode`
- `leaderId`
- `memberIds`
- `readyCount`
- `handoffReceiptId`

## Event Seed

- `party.handoff.created`
- `party.handoff.accepted`
- `party.handoff.sealed`

## Proof Seed

- Validator: `validate-party-to-match-handoff.mjs`
- Browser state: future runtime state inspection should expose snapshot and proof labels.
- Human-view: Host and members see the same launch receipt, train boarding policy, and match seed before entering gold-field.
- Report: mode id, topology id, proof tier, peer count, human count, bot count, machine count, blocked claims.

## Acceptance

The proof passes only when the network data can explain what happened across peers and the retained report blocks overclaiming.

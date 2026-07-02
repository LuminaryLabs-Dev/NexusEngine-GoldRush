# Network Domain Map

Status: active

## Domain Shape

```txt
mode policy
-> party handoff
-> transport adapter
-> connection readiness
-> room authority
-> command buffer
-> authoritative receipt ledger
-> replication snapshots
-> interest management
-> partition handoff
-> reconnect recovery
-> proof reports
```

## Ownership Rules

- Transport owns connection events and packet delivery only.
- Authority owns command ordering and accepted gameplay facts.
- Gameplay owns mining, cargo, damage, cashout, scoring, and results rules.
- Network owns how facts and state are transmitted.
- Proof owns claim labels and local/public/live boundaries.
- Renderer owns visual presentation only.

## Hard Boundary

No renderer, UI, or PeerJS callback should directly create irreversible gameplay receipts. Those receipts must pass through authority and ledger contracts.

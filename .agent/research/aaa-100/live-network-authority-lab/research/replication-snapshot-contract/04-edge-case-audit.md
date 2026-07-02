# Replication Snapshot Contract Edge Case Audit

Status: planned

## Edge Cases

- Public peer connects but cannot exchange data.
- Authority host leaves during train or cashout.
- Snapshot size grows with distant actors until clients choke.
- Client submits duplicated or impossible commands.
- Partition handoff duplicates a player.
- Reconciliation creates visible camera or player pulsing.
- Report labels same-machine peers as live 60-player proof.

## Hardening

- Add reset proof.
- Add proof-tier labels.
- Add snapshot serialization and size budget proof.
- Add fakeout flag for live-proof overclaims.
- Add chaos profile proof when timing is player-facing.

## Main Risk

Vague snapshots make prediction, replay, reconnect, and public proof impossible to reason about.

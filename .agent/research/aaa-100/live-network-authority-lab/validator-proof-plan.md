# Validator Proof Plan

Status: active

## Future Validators

- validate-network-mode-policy.mjs
- validate-party-to-match-handoff.mjs
- validate-live-room-authority.mjs
- validate-peer-transport-adapter.mjs
- validate-signaling-ice-readiness.mjs
- validate-interest-management-regions.mjs
- validate-replication-snapshot-contract.mjs
- validate-delta-priority.mjs
- validate-input-command-buffer.mjs
- validate-prediction-reconciliation.mjs
- validate-authoritative-receipt-ledger.mjs
- validate-partition-handoff-events.mjs
- validate-disconnect-rejoin-recovery.mjs
- validate-latency-jitter-loss-simulator.mjs
- validate-fairness-sanity-boundary.mjs
- validate-live-proof-harness.mjs
- validate-public-deploy-network-readiness.mjs

## Human Proof Later

- two peers join party.
- party leader launches train handoff.
- both peers enter same match seed.
- one peer mines and the other observes the receipt.
- one peer cashes out and both see results.
- disconnect produces visible and reported recovery behavior.

## Release Blocker

Do not mark live 60-player network readiness until proof includes real peer count, authority, ordered receipts, bounded replication, public deploy readiness, and failure/recovery behavior.

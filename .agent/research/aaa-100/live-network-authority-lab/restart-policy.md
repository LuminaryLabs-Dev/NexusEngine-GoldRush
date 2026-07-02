# Restart Policy

Status: active

## Restart With New Knowledge

If live networking gets unstable, restart from the lowest failing layer and keep proof labels intact.

## Restart Order

1. Mode and proof labels.
2. Transport adapter.
3. Connection readiness.
4. Authority model.
5. Receipt ledger.
6. Snapshot schema.
7. Interest management.
8. Prediction and reconciliation.
9. Partition handoff.
10. Disconnect and rejoin.
11. Sanity boundaries.
12. Public deploy network readiness.

## Stop Conditions

- Stop if a transport callback becomes gameplay authority.
- Stop if proof labels are missing.
- Stop if reports leak local details.
- Stop if a simulated run is labeled live.

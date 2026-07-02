# Input Command Buffer Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for local, public, simulated, peer, and future live modes.

## Human-View Proof

Repeated interact/fire/movement inputs create ordered commands and do not duplicate cashout or damage receipts.

## Edge Cases

- Transport opens after scene transition.
- Connection closes during train boarding.
- Snapshot arrives stale or out of order.
- Commands duplicate after reconnect.
- Authority epoch changes mid-cashout.
- Public Pages run has blocked or degraded peer connectivity.

## Failure Condition

Without command buffering, prediction and authority will fight each other and create double actions.

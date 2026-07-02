# Disconnect Rejoin Recovery Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for local, public, simulated, peer, and future live modes.

## Human-View Proof

Disconnect tests show clear cargo/inventory lock, timeout, rejoin, or drop conversion policy.

## Edge Cases

- Transport opens after scene transition.
- Connection closes during train boarding.
- Snapshot arrives stale or out of order.
- Commands duplicate after reconnect.
- Authority epoch changes mid-cashout.
- Public Pages run has blocked or degraded peer connectivity.

## Failure Condition

Without recovery policy, live proof will hide state corruption behind normal network flakiness.

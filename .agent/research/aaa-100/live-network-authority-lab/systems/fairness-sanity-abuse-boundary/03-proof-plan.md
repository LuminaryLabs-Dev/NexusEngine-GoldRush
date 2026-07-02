# Fairness Sanity Abuse Boundary Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for local, public, simulated, peer, and future live modes.

## Human-View Proof

Impossible speed, distance mining, duplicate cashout, and impossible damage commands are rejected with readable reasons.

## Edge Cases

- Transport opens after scene transition.
- Connection closes during train boarding.
- Snapshot arrives stale or out of order.
- Commands duplicate after reconnect.
- Authority epoch changes mid-cashout.
- Public Pages run has blocked or degraded peer connectivity.

## Failure Condition

A P2P match without sanity boundaries is not a fair battle royale; it is a trust demo.

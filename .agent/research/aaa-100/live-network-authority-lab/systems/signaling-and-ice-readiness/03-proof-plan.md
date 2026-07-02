# Signaling And ICE Readiness Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for local, public, simulated, peer, and future live modes.

## Human-View Proof

Proof reports show setup timing, failure labels, and whether the run had enough connectivity evidence.

## Edge Cases

- Transport opens after scene transition.
- Connection closes during train boarding.
- Snapshot arrives stale or out of order.
- Commands duplicate after reconnect.
- Authority epoch changes mid-cashout.
- Public Pages run has blocked or degraded peer connectivity.

## Failure Condition

Without connection readiness, public proof can pass locally while real peers fail on different networks.

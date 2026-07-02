# Network Mode Policy Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for local, public, simulated, peer, and future live modes.

## Human-View Proof

Reports and UI label local, public, simulated, peer-party, and future live runs without ambiguity.

## Edge Cases

- Transport opens after scene transition.
- Connection closes during train boarding.
- Snapshot arrives stale or out of order.
- Commands duplicate after reconnect.
- Authority epoch changes mid-cashout.
- Public Pages run has blocked or degraded peer connectivity.

## Failure Condition

Without mode policy, single-browser or bot proof will keep being mistaken for live 60-player readiness.

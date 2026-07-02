# 15 Latency Jitter Loss Simulator

Status: planned

## Purpose

Simulate delay, jitter, packet loss, reordering, and disconnects before live testing.

## Player Need

Networked movement and combat should stay playable under realistic connection problems.

## Owning Kits

- Generic incubator candidate: `n:network:chaos-simulator`
- GoldRush custom kit: `n:goldrush:latency-jitter-loss-simulator`

## Public API Seed

- `setNetworkChaos(profile)`
- `runChaosScenario(scenarioId)`
- `getChaosReport()`

## Internal API Seed

- `delayPacket(packet)`
- `dropPacket(packet)`
- `reorderQueue(queue)`
- `restoreCleanNetwork()`

## Events

- `chaos.profile.applied`
- `chaos.packet.delayed`
- `chaos.report.finalized`

## Snapshot

- `profileId`
- `latencyMs`
- `jitterMs`
- `lossRate`
- `reorderRate`
- `scenarioResult`

## Validator

`validate-latency-jitter-loss-simulator.mjs`

## Player-View Proof

Simulated poor network reports show movement, receipts, cashout, and disconnect policy remain bounded.

## Risk If Missing

A perfect-local-only network system will fail the first real public peer test.

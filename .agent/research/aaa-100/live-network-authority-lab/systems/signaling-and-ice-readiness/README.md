# 06 Signaling And ICE Readiness

Status: planned

## Purpose

Track signaling, ICE server configuration, connection candidate flow, and failure labels.

## Player Need

Players need clear failure or readiness states before being sent into a match.

## Owning Kits

- Generic incubator candidate: `n:network:connection-readiness`
- GoldRush custom kit: `n:goldrush:signaling-ice-readiness`

## Public API Seed

- `getConnectionReadiness()`
- `testConnection(peerId)`
- `classifyConnectionError(error)`

## Internal API Seed

- `redactIceConfig(config)`
- `measureSetupTime(peerId)`
- `mapBrowserError(error)`

## Events

- `connection.signaling.ready`
- `connection.ice.ready`
- `connection.failed`

## Snapshot

- `signalingState`
- `iceState`
- `setupMs`
- `turnRequired`
- `failureLabel`

## Validator

`validate-signaling-ice-readiness.mjs`

## Player-View Proof

Proof reports show setup timing, failure labels, and whether the run had enough connectivity evidence.

## Risk If Missing

Without connection readiness, public proof can pass locally while real peers fail on different networks.

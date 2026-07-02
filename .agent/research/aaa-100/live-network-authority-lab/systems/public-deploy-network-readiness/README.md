# 18 Public Deploy Network Readiness

Status: planned

## Purpose

Check public Pages networking behavior, signaling availability, secure context, and proof-safe configuration.

## Player Need

The public link should either support the tested network mode or explain why it cannot.

## Owning Kits

- Generic incubator candidate: `n:network:deploy-readiness`
- GoldRush custom kit: `n:goldrush:public-deploy-network-readiness`

## Public API Seed

- `checkPublicNetworkReadiness()`
- `getDeployNetworkReport()`
- `classifyDeployBlocker(blocker)`

## Internal API Seed

- `probeSecureContext()`
- `probeSignalingServer()`
- `probeIceConfig()`
- `redactConfig(report)`

## Events

- `deploy.network.checked`
- `deploy.network.blocked`
- `deploy.network.ready`

## Snapshot

- `urlMode`
- `secureContext`
- `signalingReady`
- `iceReady`
- `blockedClaims`

## Validator

`validate-public-deploy-network-readiness.mjs`

## Player-View Proof

Public proof states exactly which network modes are available on the deployed page and which live claims are blocked.

## Risk If Missing

A static Pages build can look playable while lacking the live networking prerequisites for real peers.

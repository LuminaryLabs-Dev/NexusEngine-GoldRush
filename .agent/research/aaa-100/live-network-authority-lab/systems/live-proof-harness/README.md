# 17 Live Proof Harness

Status: planned

## Purpose

Define how to prove real multi-browser, multi-peer, and eventually multi-machine matches.

## Player Need

Release claims should be backed by proof that resembles actual play, not only simulator reports.

## Owning Kits

- Generic incubator candidate: `n:network:live-proof`
- GoldRush custom kit: `n:goldrush:live-proof-harness`

## Public API Seed

- `startLiveProof(runConfig)`
- `recordPeerProof(peerId, fact)`
- `finalizeLiveProof()`

## Internal API Seed

- `comparePeerSnapshots(snapshots)`
- `redactProofReport(report)`
- `classifyProofTier(report)`

## Events

- `liveproof.started`
- `liveproof.peer.recorded`
- `liveproof.finalized`

## Snapshot

- `runId`
- `peerCount`
- `machineCount`
- `proofTier`
- `snapshotDivergence`
- `failureCount`

## Validator

`validate-live-proof-harness.mjs`

## Player-View Proof

Proof differentiates same-browser tabs, separate browser contexts, same machine, separate machines, public URL, and future live 60.

## Risk If Missing

Without proof-tier granularity, the project will keep overclaiming from narrow local browser tests.

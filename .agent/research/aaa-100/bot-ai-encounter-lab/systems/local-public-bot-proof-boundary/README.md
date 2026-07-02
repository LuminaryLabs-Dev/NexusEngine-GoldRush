# 18 Local Public Bot Proof Boundary

Status: planned

## Purpose

Define what local bot proof, public Pages proof, and future live proof can each claim.

## Player Need

The project should improve fast without confusing staging success for shipped multiplayer.

## Owning Kits

- Generic incubator candidate: `n:runtime:simulation-proof`
- GoldRush custom kit: `n:goldrush:bot-proof-boundary`

## Public API Seed

- `classifyProofRun(run)`
- `getProofBoundary()`
- `requireProofLabel(label)`

## Internal API Seed

- `compareLocalPublicReports(local, public)`
- `rejectOverclaim(report)`
- `mapProofToReleaseGate(report)`

## Events

- `proof.boundary.classified`
- `proof.overclaim.rejected`
- `proof.release-gate.updated`

## Snapshot

- `proofType`
- `allowedClaims`
- `blockedClaims`
- `releaseGate`

## Validator

`validate-local-public-bot-proof-boundary.mjs`

## Player-View Proof

A simulated 60-player bot run can pass as staging scale but cannot pass as live 60-player multiplayer.

## Risk If Missing

Without this boundary, the roadmap will mark the wrong things resolved.

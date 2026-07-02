# Public Deploy Proof Contract

Status: active docs-only

Packet: 020
Domain: deployment
Target kit: n:runtime:validation plus Build branch workflow
Roadmap atoms: 021, 024, 026, 040

## Purpose

Define the public Pages evidence required after authored terrain or map-source work changes the visible game.

## Why This Prevents Plateau

Local proof does not help the playable project if the public branch shows stale or broken terrain.

## Data Exposed

- publicUrl
- commitSha
- buildBranch
- terrainRevision
- smokeScenario
- proofStatus

## Public API Shape

- runPublicSmokeProof()
- compareLocalPublicTerrainRevision()
- writePublicDeployReport()

## Events And Snapshot

- publicProofStarted
- publicProofMatchedLocal
- publicProofMismatch

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- Build workflow succeeds
- public smoke captures map and loop proof
- local/public report confirms same source revision

## Edge Cases And Stop Conditions

- Do not call the feature done before public proof when deploy is part of the goal.
- Do not publish unsanitized local artifacts.
- Stop if public shows old revision after Build push.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

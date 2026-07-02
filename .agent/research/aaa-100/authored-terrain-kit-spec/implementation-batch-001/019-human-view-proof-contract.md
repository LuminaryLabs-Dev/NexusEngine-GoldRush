# Human View Proof Contract

Status: active docs-only

Packet: 019
Domain: proof
Target kit: n:runtime:validation plus GoldRush proof tools
Roadmap atoms: 021, 022, 024, 026, 040

## Purpose

Define screenshot and video evidence needed to judge whether the map feels like a coherent large desert space from player view.

## Why This Prevents Plateau

Machine checks cannot tell whether the authored map reads as a believable place, travel route, combat space, and extraction arena.

## Data Exposed

- proofScenario
- viewport
- cameraState
- playerState
- terrainRevision
- observedIssueTags

## Public API Shape

- captureLocalHumanViewProof(scenario)
- capturePublicHumanViewProof(scenario)
- summarizeVisualFindings()

## Events And Snapshot

- humanProofCaptured
- humanProofIssueFound
- humanProofAccepted

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- capture title/lobby/loading/spawn/walk/mine/carry/cashout/results
- capture near/mid/far terrain and prop readability
- record short movement video for camera/ground stability

## Edge Cases And Stop Conditions

- Do not accept screenshots that only show debug overlays.
- Do not rely on one camera angle.
- Stop if player cannot understand scale, route, or objective in normal view.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

# Restart Rollback Contract

Status: active docs-only

Packet: 022
Domain: runtime
Target kit: n:runtime:snapshot plus n:runtime:domain-registry
Roadmap atoms: 021, 023, 024, 026

## Purpose

Define how the game resets terrain, consumers, and camera authority between title, lobby, train, run, results, and test scenarios.

## Why This Prevents Plateau

The pulsing and conflicting-motion class of bugs returns when old scene/test systems keep authority after transitions.

## Data Exposed

- sceneId
- activeTerrainRevision
- registeredConsumers
- cameraAuthorityId
- physicsWorldId
- resetReason

## Public API Shape

- resetTerrainConsumers(reason)
- rebindSceneToTerrain(sourceRevision)
- getRestartSnapshot()

## Events And Snapshot

- sceneResetStarted
- terrainConsumersRebound
- staleAuthorityRemoved

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI asserts one active terrain source and one camera authority after each scene transition
- Playwright loop re-enters scenes without stale terrain/camera state

## Edge Cases And Stop Conditions

- Do not preserve test helpers across player gameplay scenes.
- Do not keep old colliders after terrain source changes.
- Stop if scene transition leaves duplicate consumer registrations.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

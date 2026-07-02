# Micro 011 Matrix - Rail And Train Reference Contract

Status: active docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Track the 12 micro-steps that must be designed before future rail and train reference code starts.

| Step | Packet | Source Field | Status | Required Proof | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| 001 | [Rail Spline Schema](micro/001-rail-spline-schema.md) | `railSplines` | planned docs-only | validator proves source-owned rail splines have id, control points, tangent policy, direction labels, grade bands, speed bands, segment ids, and revision. | Stop if the train can move on hardcoded points, local curve objects, or renderer-only rails. |
| 002 | [Train Stop And Platform Anchor](micro/002-train-stop-and-platform-anchor.md) | `trainStopAnchors` | planned docs-only | validator proves train stop anchors have id, position, facing, platform side, door side, approach radius, boarding range, and revision. | Stop if the player can board at an unannotated transform or a renderer-only platform. |
| 003 | [Loading Yard To Match Edge Link](micro/003-loading-yard-to-match-edge-link.md) | `loadingYardMapEdgeLinks` | planned docs-only | validator proves loading scene and match map use shared rail edge ids, direction labels, handoff markers, and fixture revision. | Stop if the transition teleports between scenes without source rail continuity. |
| 004 | [Train Path Sampling Api](micro/004-train-path-sampling-api.md) | `trainPathQueryApi` | planned docs-only | sampleRailAt reports position, tangent, normal, bank, progress, segment id, station relation, speed band, and revision at named proof points. | Stop if train transforms use local curve math outside the route-spline kit. |
| 005 | [Train Door And Boarding Side Contract](micro/005-train-door-and-boarding-side-contract.md) | `trainDoorBoardingSides` | planned docs-only | validator proves each stop names valid door side, platform side, step-up height, lock pose, camera side, prompt side, and revision. | Stop if a train door can open on the wrong side or boarding can ignore platform side. |
| 006 | [Train Motion State Contract](micro/006-train-motion-state-contract.md) | `trainMotionStates` | planned docs-only | validator proves arrival, idle, boarding, door-open, lock-in, departure, ride-away, and offscreen phases use rail progress, speed band, and revision. | Stop if the train moves sideways or phase time drives world transform without a rail sample. |
| 007 | [Rail Terrain Parity](micro/007-rail-terrain-parity.md) | `railTerrainParity` | planned docs-only | validator proves rail samples sit on terrain via source height/slope queries and expose clearance, grade, blocker, and revision checks. | Stop if rail mesh and terrain height derive independently or tracks float/bury at proof points. |
| 008 | [Rail Prop Placement Parity](micro/008-rail-prop-placement-parity.md) | `railPropPlacementEcho` | planned docs-only | renderer snapshots echo rail anchor ids, raycast hits, prop family ids, spacing policy, side label, and fixture revision. | Stop if tracks are visual-only props with no source-owned placement anchors. |
| 009 | [Train Camera Follow Contract](micro/009-train-camera-follow-contract.md) | `trainCameraRailHandoff` | planned docs-only | validator proves camera follow, over-shoulder return, train ride framing, player lock state, rail sample target, and revision are reported together. | Stop if a rail cinematic and gameplay camera can both move the camera in the same phase. |
| 010 | [Train Audio Cue Route Contract](micro/010-train-audio-cue-route-contract.md) | `trainAudioRouteCues` | planned docs-only | validator proves train audio cues bind to rail segment id, distance band, motion state, door side, cue id, volume policy, and revision. | Stop if train audio fires from timers only or cannot name rail/motion provenance. |
| 011 | [Rail Negative Fixture Cases](micro/011-rail-negative-fixture-cases.md) | `railNegativeCases` | planned docs-only | validator fails reversed direction labels, broken splines, missing doors, off-terrain rails, impossible approaches, mismatched scene edges, and stale echoes. | Stop if validation only proves a train mesh or rail mesh exists. |
| 012 | [Rail Stale Proof](micro/012-rail-stale-proof.md) | `railRevisionPolicy` | planned docs-only | source revision changes mark rail meshes, train motion, boarding locks, camera handoff, audio cues, screenshots, simulator proof, and public proof stale. | Stop if source rail changes do not force train, scene, camera, audio, and public proof refresh. |

## Implementation Boundary

Do not implement runtime train or rail behavior from this matrix yet. Future code should pick one row, add the smallest source fixture and validator proof for that row, and stop if any scene, renderer, physics, camera, audio, boarding, or proof consumer can bypass source route identity.

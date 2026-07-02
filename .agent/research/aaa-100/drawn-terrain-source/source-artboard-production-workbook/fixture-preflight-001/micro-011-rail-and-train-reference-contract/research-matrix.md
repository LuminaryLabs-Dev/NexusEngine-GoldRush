# Micro 011 Research Matrix - Rail And Train Reference Contract

Status: active docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Pair every rail/train micro-step with a small research packet before implementation.

| Step | Packet | Source Field | Status | Research Focus |
| --- | --- | --- | --- | --- |
| 001 | [Rail Spline Schema Research](research/001-rail-spline-schema-research.md) | `railSplines` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 002 | [Train Stop And Platform Anchor Research](research/002-train-stop-and-platform-anchor-research.md) | `trainStopAnchors` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 003 | [Loading Yard To Match Edge Link Research](research/003-loading-yard-to-match-edge-link-research.md) | `loadingYardMapEdgeLinks` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 004 | [Train Path Sampling Api Research](research/004-train-path-sampling-api-research.md) | `trainPathQueryApi` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 005 | [Train Door And Boarding Side Contract Research](research/005-train-door-and-boarding-side-contract-research.md) | `trainDoorBoardingSides` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 006 | [Train Motion State Contract Research](research/006-train-motion-state-contract-research.md) | `trainMotionStates` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 007 | [Rail Terrain Parity Research](research/007-rail-terrain-parity-research.md) | `railTerrainParity` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 008 | [Rail Prop Placement Parity Research](research/008-rail-prop-placement-parity-research.md) | `railPropPlacementEcho` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 009 | [Train Camera Follow Contract Research](research/009-train-camera-follow-contract-research.md) | `trainCameraRailHandoff` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 010 | [Train Audio Cue Route Contract Research](research/010-train-audio-cue-route-contract-research.md) | `trainAudioRouteCues` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 011 | [Rail Negative Fixture Cases Research](research/011-rail-negative-fixture-cases-research.md) | `railNegativeCases` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |
| 012 | [Rail Stale Proof Research](research/012-rail-stale-proof-research.md) | `railRevisionPolicy` | planned docs-only | Connect train/rail behavior to source-owned route splines, terrain parity, scene transition, camera, audio, and proof constraints. |

## Source Signals

- Unreal Blueprint Splines: spline components and spline mesh components are established engine tools for path-authored objects and repeated meshes. Reference: https://dev.epicgames.com/documentation/unreal-engine/blueprint-splines-in-unreal-engine?lang=en-US
- Unity Splines manual: splines are used to generate objects and behaviors along paths, trajectories, and shapes. Reference: https://docs.unity3d.com/Packages/com.unity.splines%402.4/manual/index.html
- three.js CatmullRomCurve3 docs: browser runtime path sampling can use curve points for smooth 3D route representation. Reference: https://threejs.org/docs/pages/CatmullRomCurve3.html
- three.js TubeGeometry docs: geometry can be generated along a 3D curve, but path identity should still come from source data. Reference: https://threejs.org/docs/pages/TubeGeometry.html
- Apex Legends Season 3 Meltdown notes: a train can define a map fantasy, route identity, and onboarding destination in a battle-royale arena. Reference: https://forums.ea.com/blog/apex-legends-game-info-hub-en/season-3-meltdown-patch-notes/9458756
- Apex Legends Season 6 map updates: train routes, static cars, tunnels, loot, cover, and rotations show that rail features affect traversal and combat readability. Reference: https://forums.ea.com/blog/apex-legends-game-info-hub-en/season-6-map-updates/9462020
- GitHub Game Engines Collection: mature game stacks separate world data, rendering, physics, gameplay, audio, networking, and validation concerns. Reference: https://github.com/collections/game-engines

# Micro 011 Simulation Matrix - Rail And Train Reference Contract

Status: active docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Predict implementation failure modes for each rail/train source-data concern before future code changes.

| Step | Packet | Source Field | Status | Simulation Focus |
| --- | --- | --- | --- | --- |
| 001 | [Rail Spline Schema Simulation](simulations/001-rail-spline-schema-simulation.md) | `railSplines` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 002 | [Train Stop And Platform Anchor Simulation](simulations/002-train-stop-and-platform-anchor-simulation.md) | `trainStopAnchors` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 003 | [Loading Yard To Match Edge Link Simulation](simulations/003-loading-yard-to-match-edge-link-simulation.md) | `loadingYardMapEdgeLinks` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 004 | [Train Path Sampling Api Simulation](simulations/004-train-path-sampling-api-simulation.md) | `trainPathQueryApi` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 005 | [Train Door And Boarding Side Contract Simulation](simulations/005-train-door-and-boarding-side-contract-simulation.md) | `trainDoorBoardingSides` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 006 | [Train Motion State Contract Simulation](simulations/006-train-motion-state-contract-simulation.md) | `trainMotionStates` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 007 | [Rail Terrain Parity Simulation](simulations/007-rail-terrain-parity-simulation.md) | `railTerrainParity` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 008 | [Rail Prop Placement Parity Simulation](simulations/008-rail-prop-placement-parity-simulation.md) | `railPropPlacementEcho` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 009 | [Train Camera Follow Contract Simulation](simulations/009-train-camera-follow-contract-simulation.md) | `trainCameraRailHandoff` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 010 | [Train Audio Cue Route Contract Simulation](simulations/010-train-audio-cue-route-contract-simulation.md) | `trainAudioRouteCues` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 011 | [Rail Negative Fixture Cases Simulation](simulations/011-rail-negative-fixture-cases-simulation.md) | `railNegativeCases` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |
| 012 | [Rail Stale Proof Simulation](simulations/012-rail-stale-proof-simulation.md) | `railRevisionPolicy` | planned docs-only | Predict how future implementation can fail if train motion, boarding, camera, audio, or rails are hardcoded, renderer-owned, stale, or detached from source route data. |

## Simulation Rule

A future implementation simulation fails if the train can arrive, board, depart, move the camera, play cues, transition scenes, or pass public proof without echoing a source-owned rail spline id, stop anchor id, direction label, motion state, and fixture revision where required.

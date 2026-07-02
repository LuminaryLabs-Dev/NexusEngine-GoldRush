# Micro 011 Audit Matrix - Rail And Train Reference Contract

Status: active docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Define hardening checks for each future rail/train implementation slice.

| Step | Packet | Source Field | Status | Audit Focus |
| --- | --- | --- | --- | --- |
| 001 | [Rail Spline Schema Audit](audits/001-rail-spline-schema-audit.md) | `railSplines` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 002 | [Train Stop And Platform Anchor Audit](audits/002-train-stop-and-platform-anchor-audit.md) | `trainStopAnchors` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 003 | [Loading Yard To Match Edge Link Audit](audits/003-loading-yard-to-match-edge-link-audit.md) | `loadingYardMapEdgeLinks` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 004 | [Train Path Sampling Api Audit](audits/004-train-path-sampling-api-audit.md) | `trainPathQueryApi` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 005 | [Train Door And Boarding Side Contract Audit](audits/005-train-door-and-boarding-side-contract-audit.md) | `trainDoorBoardingSides` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 006 | [Train Motion State Contract Audit](audits/006-train-motion-state-contract-audit.md) | `trainMotionStates` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 007 | [Rail Terrain Parity Audit](audits/007-rail-terrain-parity-audit.md) | `railTerrainParity` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 008 | [Rail Prop Placement Parity Audit](audits/008-rail-prop-placement-parity-audit.md) | `railPropPlacementEcho` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 009 | [Train Camera Follow Contract Audit](audits/009-train-camera-follow-contract-audit.md) | `trainCameraRailHandoff` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 010 | [Train Audio Cue Route Contract Audit](audits/010-train-audio-cue-route-contract-audit.md) | `trainAudioRouteCues` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 011 | [Rail Negative Fixture Cases Audit](audits/011-rail-negative-fixture-cases-audit.md) | `railNegativeCases` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |
| 012 | [Rail Stale Proof Audit](audits/012-rail-stale-proof-audit.md) | `railRevisionPolicy` | planned docs-only | Require source ownership, consumer echo, negative fixture, player-view readability, camera authority, audio parity, and stale-proof gates. |

## Audit Rule

A future implementation does not pass if it proves only that a train or rail mesh exists. It must prove player-readable train route identity, source-owned rail geometry, boarding side parity, camera authority, audio provenance, consumer parity, negative cases, and stale-proof refresh.

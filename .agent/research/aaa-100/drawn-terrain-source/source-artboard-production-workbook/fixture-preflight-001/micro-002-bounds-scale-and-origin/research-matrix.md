# Bounds Scale And Origin Research Matrix

Status: active docs-only
Parent atom: `002-bounds-scale-and-origin`

## Purpose

Track the research note paired to each bounds, scale, and origin micro-step.

| ID | Research packet | Main risk being constrained |
| --- | --- | --- |
| 001 | [World Coordinate System research](research/001-world-coordinate-system-research.md) | renderer, physics, placement, and gameplay interpret positions in different axes |
| 002 | [Unit Scale Contract research](research/002-unit-scale-contract-research.md) | player speed, mountain size, collider size, and 60-player density drift apart |
| 003 | [Playable Bounds Rectangle research](research/003-playable-bounds-rectangle-research.md) | large terrain looks big but gameplay still happens in a tiny or undefined area |
| 004 | [Origin Anchor Policy research](research/004-origin-anchor-policy-research.md) | asset anchors and gameplay markers drift when the source artboard is moved |
| 005 | [Cell Size And Sample Spacing research](research/005-cell-size-and-sample-spacing-research.md) | terrain seams and raycast mismatch appear because consumers resample at different spacing |
| 006 | [Vertical Range Budget research](research/006-vertical-range-budget-research.md) | mountains become unreadable blockers or flat hills after scale changes |
| 007 | [Out Of Bounds Negative Case research](research/007-out-of-bounds-negative-case-research.md) | players, bots, and props can exist beyond the authored map without explicit handling |
| 008 | [Query Clamp Vs Reject Policy research](research/008-query-clamp-vs-reject-policy-research.md) | debug proof passes by clamping broken points instead of exposing map boundary errors |
| 009 | [Spawn Route Scale Check research](research/009-spawn-route-scale-check-research.md) | the map is technically large but traversal pacing is not battle-royale readable |
| 010 | [LOD Partition Scale Echo research](research/010-lod-partition-scale-echo-research.md) | visual streaming and 60-player room scale use different map dimensions |
| 011 | [Physics Render Scale Parity research](research/011-physics-render-scale-parity-research.md) | the player appears above, below, or inside terrain because visual and physical worlds disagree |
| 012 | [Scale Restart Policy research](research/012-scale-restart-policy-research.md) | old screenshots, caches, or public proof are reused after a map scale change |

## Source Set

- Unreal Landscape Technical Guide: https://dev.epicgames.com/documentation/unreal-engine/landscape-technical-guide-in-unreal-engine
- Unity terrain heightmaps: https://docs.unity3d.com/6000.0/Documentation/Manual/terrain-Heightmaps.html
- Unity terrain colliders: https://docs.unity3d.com/6000.4/Documentation/Manual/terrain-colliders-introduction.html
- Three.js LOD: https://threejs.org/docs/pages/LOD.html
- GitHub game engines collection: https://github.com/collections/game-engines

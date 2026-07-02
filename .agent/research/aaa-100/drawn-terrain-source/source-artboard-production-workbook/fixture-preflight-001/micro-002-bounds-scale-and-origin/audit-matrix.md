# Bounds Scale And Origin Audit Matrix

Status: active docs-only
Parent atom: `002-bounds-scale-and-origin`

## Purpose

Track hardening audits for each bounds, scale, and origin micro-step.

| ID | Audit packet | Fake-completion risk |
| --- | --- | --- |
| 001 | [World Coordinate System audit](audits/001-world-coordinate-system-audit.md) | renderer, physics, placement, and gameplay interpret positions in different axes |
| 002 | [Unit Scale Contract audit](audits/002-unit-scale-contract-audit.md) | player speed, mountain size, collider size, and 60-player density drift apart |
| 003 | [Playable Bounds Rectangle audit](audits/003-playable-bounds-rectangle-audit.md) | large terrain looks big but gameplay still happens in a tiny or undefined area |
| 004 | [Origin Anchor Policy audit](audits/004-origin-anchor-policy-audit.md) | asset anchors and gameplay markers drift when the source artboard is moved |
| 005 | [Cell Size And Sample Spacing audit](audits/005-cell-size-and-sample-spacing-audit.md) | terrain seams and raycast mismatch appear because consumers resample at different spacing |
| 006 | [Vertical Range Budget audit](audits/006-vertical-range-budget-audit.md) | mountains become unreadable blockers or flat hills after scale changes |
| 007 | [Out Of Bounds Negative Case audit](audits/007-out-of-bounds-negative-case-audit.md) | players, bots, and props can exist beyond the authored map without explicit handling |
| 008 | [Query Clamp Vs Reject Policy audit](audits/008-query-clamp-vs-reject-policy-audit.md) | debug proof passes by clamping broken points instead of exposing map boundary errors |
| 009 | [Spawn Route Scale Check audit](audits/009-spawn-route-scale-check-audit.md) | the map is technically large but traversal pacing is not battle-royale readable |
| 010 | [LOD Partition Scale Echo audit](audits/010-lod-partition-scale-echo-audit.md) | visual streaming and 60-player room scale use different map dimensions |
| 011 | [Physics Render Scale Parity audit](audits/011-physics-render-scale-parity-audit.md) | the player appears above, below, or inside terrain because visual and physical worlds disagree |
| 012 | [Scale Restart Policy audit](audits/012-scale-restart-policy-audit.md) | old screenshots, caches, or public proof are reused after a map scale change |

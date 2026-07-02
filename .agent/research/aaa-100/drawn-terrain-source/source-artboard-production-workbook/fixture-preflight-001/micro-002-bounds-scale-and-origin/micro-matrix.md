# Bounds Scale And Origin Micro Matrix

Status: implemented-local
Parent atom: `002-bounds-scale-and-origin`

## Purpose

Track the 12 micro-steps required before future code can safely claim the terrain fixture has usable world bounds, scale, and origin.

| ID | Micro atom | Source field | Required proof | State |
| --- | --- | --- | --- | --- |
| 001 | [World Coordinate System](micro/001-world-coordinate-system.md) | coordinateSystem | snapshot names handedness, axes, and up vector before any consumer samples terrain | implemented-local |
| 002 | [Unit Scale Contract](micro/002-unit-scale-contract.md) | unitScale | queries echo meters-per-unit and reject missing or zero unit scale | implemented-local |
| 003 | [Playable Bounds Rectangle](micro/003-playable-bounds-rectangle.md) | worldBounds | inside and outside query points return deterministic accept or reject results | implemented-local |
| 004 | [Origin Anchor Policy](micro/004-origin-anchor-policy.md) | origin | spawn, rail, town, mine, and extraction anchors report the same origin reference | implemented-local |
| 005 | [Cell Size And Sample Spacing](micro/005-cell-size-and-sample-spacing.md) | cellSize | height, mask, LOD, and placement samples report shared cell size | implemented-local |
| 006 | [Vertical Range Budget](micro/006-vertical-range-budget.md) | heightRange | height queries report min, max, and normalized range from the fixture | implemented-local |
| 007 | [Out Of Bounds Negative Case](micro/007-out-of-bounds-negative-case.md) | boundsPolicy | validator fails a fixture where outside points silently clamp as playable ground | implemented-local |
| 008 | [Query Clamp Vs Reject Policy](micro/008-query-clamp-vs-reject-policy.md) | queryBoundsMode | each query type declares reject, clamp, or nearest-edge behavior | implemented-local |
| 009 | [Spawn Route Scale Check](micro/009-spawn-route-scale-check.md) | scaleProofAnchors | spawn-to-mine, mine-to-cashout, and town-to-rail distances are within named budgets | implemented-local |
| 010 | [LOD Partition Scale Echo](micro/010-lod-partition-scale-echo.md) | scaleConsumers | LOD cells and network partition descriptors echo bounds and unit scale | implemented-local |
| 011 | [Physics Render Scale Parity](micro/011-physics-render-scale-parity.md) | consumerScaleEcho | render mesh, collider, and raycast snapshots report identical bounds and scale | implemented-local |
| 012 | [Scale Restart Policy](micro/012-scale-restart-policy.md) | scaleRevisionPolicy | changing bounds, origin, unit scale, or cell size marks derived proof stale | implemented-local |

## Use Rule

Future implementation should move to `micro-003-height-sample-contract` and stop if height data cannot consume these shared bounds, unit scale, origin, and stale-proof rules.

## Local Proof

- Validator: `node tools/validation/validate-authored-terrain-fixture.mjs`
- Full gate: `npm run validate`
- Build gate: `npm run build`
- Current source revision: `rev-e85d24b5`

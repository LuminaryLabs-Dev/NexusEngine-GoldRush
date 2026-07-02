# Bounds Scale And Origin Simulation Matrix

Status: active docs-only
Parent atom: `002-bounds-scale-and-origin`

## Purpose

Track the dry-run implementation simulation paired to each bounds, scale, and origin micro-step.

| ID | Simulation packet | Simulated pass target |
| --- | --- | --- |
| 001 | [World Coordinate System simulation](simulations/001-world-coordinate-system-simulation.md) | snapshot names handedness, axes, and up vector before any consumer samples terrain |
| 002 | [Unit Scale Contract simulation](simulations/002-unit-scale-contract-simulation.md) | queries echo meters-per-unit and reject missing or zero unit scale |
| 003 | [Playable Bounds Rectangle simulation](simulations/003-playable-bounds-rectangle-simulation.md) | inside and outside query points return deterministic accept or reject results |
| 004 | [Origin Anchor Policy simulation](simulations/004-origin-anchor-policy-simulation.md) | spawn, rail, town, mine, and extraction anchors report the same origin reference |
| 005 | [Cell Size And Sample Spacing simulation](simulations/005-cell-size-and-sample-spacing-simulation.md) | height, mask, LOD, and placement samples report shared cell size |
| 006 | [Vertical Range Budget simulation](simulations/006-vertical-range-budget-simulation.md) | height queries report min, max, and normalized range from the fixture |
| 007 | [Out Of Bounds Negative Case simulation](simulations/007-out-of-bounds-negative-case-simulation.md) | validator fails a fixture where outside points silently clamp as playable ground |
| 008 | [Query Clamp Vs Reject Policy simulation](simulations/008-query-clamp-vs-reject-policy-simulation.md) | each query type declares reject, clamp, or nearest-edge behavior |
| 009 | [Spawn Route Scale Check simulation](simulations/009-spawn-route-scale-check-simulation.md) | spawn-to-mine, mine-to-cashout, and town-to-rail distances are within named budgets |
| 010 | [LOD Partition Scale Echo simulation](simulations/010-lod-partition-scale-echo-simulation.md) | LOD cells and network partition descriptors echo bounds and unit scale |
| 011 | [Physics Render Scale Parity simulation](simulations/011-physics-render-scale-parity-simulation.md) | render mesh, collider, and raycast snapshots report identical bounds and scale |
| 012 | [Scale Restart Policy simulation](simulations/012-scale-restart-policy-simulation.md) | changing bounds, origin, unit scale, or cell size marks derived proof stale |

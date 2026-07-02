# Height Sample Contract Simulation Matrix

Status: active docs-only
Parent atom: `003-height-sample-contract`

## Purpose

Track the dry-run implementation simulation paired to each height sample micro-step.

| ID | Simulation packet | Simulated pass target |
| --- | --- | --- |
| 001 | [Height Sample Array Shape simulation](simulations/001-height-sample-array-shape-simulation.md) | validator proves the fixture has a rectangular finite height array with declared width and height |
| 002 | [Height Value Domain simulation](simulations/002-height-value-domain-simulation.md) | validator rejects NaN, infinite, string, null, and out-of-range height samples |
| 003 | [Height Normalization Policy simulation](simulations/003-height-normalization-policy-simulation.md) | snapshot states whether stored heights are world-space, normalized, or offset-scaled |
| 004 | [Height Origin And Offset simulation](simulations/004-height-origin-and-offset-simulation.md) | sampleHeight reports source height, offset, and world height for proof points |
| 005 | [Cell Id And Sample Address simulation](simulations/005-cell-id-and-sample-address-simulation.md) | sampleHeight returns source cell id, sample index, and fractional coordinate context |
| 006 | [Interpolation Mode Contract simulation](simulations/006-interpolation-mode-contract-simulation.md) | sampleHeight declares nearest, bilinear, barycentric, or fixed-mode interpolation |
| 007 | [Edge Sample Policy simulation](simulations/007-edge-sample-policy-simulation.md) | edge and corner sample queries have explicit accept, clamp, or reject behavior |
| 008 | [Height Query Api Shape simulation](simulations/008-height-query-api-shape-simulation.md) | public API returns a serializable height hit object with finite world height and revision echo |
| 009 | [Known Proof Points simulation](simulations/009-known-proof-points-simulation.md) | validator checks named spawn, route, mine, cashout, and blocker sample points |
| 010 | [Render Collider Height Parity simulation](simulations/010-render-collider-height-parity-simulation.md) | render, collider, raycast, and movement snapshots echo matching height values for the same proof points |
| 011 | [Height Negative Fixture Cases simulation](simulations/011-height-negative-fixture-cases-simulation.md) | validator fails missing grid, bad dimensions, non-finite values, and mismatched sample counts |
| 012 | [Height Revision Stale Proof simulation](simulations/012-height-revision-stale-proof-simulation.md) | height sample changes mark render, collider, placement, gameplay, screenshot, and public proof stale |

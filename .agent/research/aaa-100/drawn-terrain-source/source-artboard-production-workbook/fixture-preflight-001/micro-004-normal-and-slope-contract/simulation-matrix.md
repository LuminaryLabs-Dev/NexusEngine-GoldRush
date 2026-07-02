# Normal And Slope Contract Simulation Matrix

Status: implemented-local
Parent atom: `004-normal-and-slope-contract`

## Purpose

Track the dry-run implementation simulation paired to each normal and slope micro-step.

| ID | Simulation packet | Simulated pass target |
| --- | --- | --- |
| 001 | [Normal Vector Shape simulation](simulations/001-normal-vector-shape-simulation.md) | sampleGround returns a three-component finite unit normal for every named walkable proof point | implemented-local |
| 002 | [Normal Space Contract simulation](simulations/002-normal-space-contract-simulation.md) | snapshot states whether normals are source-local, fixture-local, or world-space and how consumers convert them | implemented-local |
| 003 | [Slope Value Domain simulation](simulations/003-slope-value-domain-simulation.md) | validator rejects non-finite, negative, and impossible slope values outside the declared domain | implemented-local |
| 004 | [Slope Class Taxonomy simulation](simulations/004-slope-class-taxonomy-simulation.md) | sampleGround returns flat, walkable, steep, blocker, or edge class from source thresholds | implemented-local |
| 005 | [Walkable Slope Thresholds simulation](simulations/005-walkable-slope-thresholds-simulation.md) | movement proof can name slope thresholds for walk, slow, slide, and blocked results | implemented-local |
| 006 | [Normal Derivation Source simulation](simulations/006-normal-derivation-source-simulation.md) | normal calculation declares whether it comes from authored normal layer, height gradients, or validated hybrid source | implemented-local |
| 007 | [Gradient Sample Neighborhood simulation](simulations/007-gradient-sample-neighborhood-simulation.md) | height-gradient normals declare sample neighborhood and edge behavior | implemented-local |
| 008 | [Sample Ground Api Shape simulation](simulations/008-sample-ground-api-shape-simulation.md) | public API returns height, normal, slope, class, fixture id, revision id, and source cell id together | implemented-local |
| 009 | [Movement Consumer Parity simulation](simulations/009-movement-consumer-parity-simulation.md) | movement snapshot echoes source normal and slope used for grounded, slow, slide, or blocked state | implemented-local |
| 010 | [Placement Consumer Parity simulation](simulations/010-placement-consumer-parity-simulation.md) | prop placement snapshot echoes source normal and slope used for alignment or rejection | implemented-local |
| 011 | [Slope Negative Fixture Cases simulation](simulations/011-slope-negative-fixture-cases-simulation.md) | validator fails missing normals, non-unit normals, impossible slopes, and class-threshold contradictions | implemented-local |
| 012 | [Normal Slope Stale Proof simulation](simulations/012-normal-slope-stale-proof-simulation.md) | normal or slope changes mark movement, placement, collider, screenshot, and public proof stale | implemented-local |

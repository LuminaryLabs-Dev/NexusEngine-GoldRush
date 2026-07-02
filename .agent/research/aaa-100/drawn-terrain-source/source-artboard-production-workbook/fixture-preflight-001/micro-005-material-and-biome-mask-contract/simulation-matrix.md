# Material And Biome Mask Contract Simulation Matrix

Status: implemented-local
Parent atom: `005-material-and-biome-mask-contract`

## Purpose

Track the dry-run implementation simulation paired to each material and biome micro-step.

| ID | Simulation packet | Simulated pass target |
| --- | --- | --- |
| 001 | [Material Mask Schema simulation](simulations/001-material-mask-schema-simulation.md) | validator proves each source cell has a material mask entry or explicit inherited base material |
| 002 | [Biome Mask Schema simulation](simulations/002-biome-mask-schema-simulation.md) | validator proves each source cell can report a desert biome tag or an explicit no-biome exception |
| 003 | [Material Tag Taxonomy simulation](simulations/003-material-tag-taxonomy-simulation.md) | source fixture exposes a closed tag set for sand, rock, gravel, clay, wood, rail, water, and mine-tailings surfaces |
| 004 | [Biome Tag Taxonomy simulation](simulations/004-biome-tag-taxonomy-simulation.md) | source fixture exposes a closed biome set for basin, mesa, wash, mine-shelf, town-shelf, rail-bed, gold-seam, and extraction-site regions |
| 005 | [Mask Weight Domain simulation](simulations/005-mask-weight-domain-simulation.md) | validator rejects non-finite, negative, over-one, and under-specified blend weights |
| 006 | [Layer Priority And Blend Policy simulation](simulations/006-layer-priority-and-blend-policy-simulation.md) | source fixture declares base layer, override layers, blend mode, and tie-break behavior |
| 007 | [Render Material Consumer Parity simulation](simulations/007-render-material-consumer-parity-simulation.md) | render snapshot names the source material and biome tags used for terrain material selection |
| 008 | [Audio Vfx Surface Consumer Parity simulation](simulations/008-audio-vfx-surface-consumer-parity-simulation.md) | audio and VFX cue descriptors can name source material and biome tags for proof points |
| 009 | [Placement Biome Filter Parity simulation](simulations/009-placement-biome-filter-parity-simulation.md) | asset placement snapshot names material and biome tags used to accept or reject object anchors |
| 010 | [Gameplay Zone Material Parity simulation](simulations/010-gameplay-zone-material-parity-simulation.md) | mining, cashout, cover, and pressure descriptors can name material or biome tags when they affect rules or readability |
| 011 | [Mask Negative Fixture Cases simulation](simulations/011-mask-negative-fixture-cases-simulation.md) | validator fails missing masks, unknown tags, invalid weights, ambiguous dominant layers, and consumer tag drift |
| 012 | [Material Biome Stale Proof simulation](simulations/012-material-biome-stale-proof-simulation.md) | material or biome changes mark render, audio, VFX, placement, gameplay, screenshot, and public proof stale |

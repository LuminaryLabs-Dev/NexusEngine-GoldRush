# Material And Biome Mask Contract Micro Matrix

Status: implemented-local
Parent atom: `005-material-and-biome-mask-contract`

## Purpose

Track the 12 micro-steps required before future code can safely claim the terrain fixture has usable material and biome masks.

| ID | Micro atom | Source field | Required proof | State |
| --- | --- | --- | --- | --- |
| 001 | [Material Mask Schema](micro/001-material-mask-schema.md) | materialMask | validator proves each source cell has a material mask entry or explicit inherited base material | implemented-local |
| 002 | [Biome Mask Schema](micro/002-biome-mask-schema.md) | biomeMask | validator proves each source cell can report a desert biome tag or an explicit no-biome exception | implemented-local |
| 003 | [Material Tag Taxonomy](micro/003-material-tag-taxonomy.md) | materialTags | source fixture exposes a closed tag set for sand, rock, gravel, clay, wood, rail, water, and mine-tailings surfaces | implemented-local |
| 004 | [Biome Tag Taxonomy](micro/004-biome-tag-taxonomy.md) | biomeTags | source fixture exposes a closed biome set for basin, mesa, wash, mine-shelf, town-shelf, rail-bed, gold-seam, and extraction-site regions | implemented-local |
| 005 | [Mask Weight Domain](micro/005-mask-weight-domain.md) | maskWeights | validator rejects non-finite, negative, over-one, and under-specified blend weights | implemented-local |
| 006 | [Layer Priority And Blend Policy](micro/006-layer-priority-and-blend-policy.md) | layerBlendPolicy | source fixture declares base layer, override layers, blend mode, and tie-break behavior | implemented-local |
| 007 | [Render Material Consumer Parity](micro/007-render-material-consumer-parity.md) | renderMaterialEcho | render snapshot names the source material and biome tags used for terrain material selection | implemented-local |
| 008 | [Audio Vfx Surface Consumer Parity](micro/008-audio-vfx-surface-consumer-parity.md) | audioVfxSurfaceEcho | audio and VFX cue descriptors can name source material and biome tags for proof points | implemented-local |
| 009 | [Placement Biome Filter Parity](micro/009-placement-biome-filter-parity.md) | placementBiomeEcho | asset placement snapshot names material and biome tags used to accept or reject object anchors | implemented-local |
| 010 | [Gameplay Zone Material Parity](micro/010-gameplay-zone-material-parity.md) | gameplaySurfaceEcho | mining, cashout, cover, and pressure descriptors can name material or biome tags when they affect rules or readability | implemented-local |
| 011 | [Mask Negative Fixture Cases](micro/011-mask-negative-fixture-cases.md) | maskNegativeCases | validator fails missing masks, unknown tags, invalid weights, ambiguous dominant layers, and consumer tag drift | implemented-local |
| 012 | [Material Biome Stale Proof](micro/012-material-biome-stale-proof.md) | materialBiomeRevisionPolicy | material or biome changes mark render, audio, VFX, placement, gameplay, screenshot, and public proof stale | implemented-local |

## Use Rule

Future implementation should start at 001 and stop whenever a validator can pass without proving source-owned material and biome tags plus consumer echo.

# Material And Biome Mask Contract Audit Matrix

Status: implemented-local
Parent atom: `005-material-and-biome-mask-contract`

## Purpose

Track hardening audits for each material and biome micro-step.

| ID | Audit packet | Fake-completion risk |
| --- | --- | --- |
| 001 | [Material Mask Schema audit](audits/001-material-mask-schema-audit.md) | renderer fills missing surface identity with a default color while gameplay and audio know nothing about it |
| 002 | [Biome Mask Schema audit](audits/002-biome-mask-schema-audit.md) | asset scatter and gameplay zones invent biome identity outside the source fixture |
| 003 | [Material Tag Taxonomy audit](audits/003-material-tag-taxonomy-audit.md) | render, audio, VFX, and placement use inconsistent names for the same ground surface |
| 004 | [Biome Tag Taxonomy audit](audits/004-biome-tag-taxonomy-audit.md) | map regions look different but do not drive placement, route readability, or gameplay pressure consistently |
| 005 | [Mask Weight Domain audit](audits/005-mask-weight-domain-audit.md) | layer blending hides invalid masks and consumers disagree about the dominant terrain surface |
| 006 | [Layer Priority And Blend Policy audit](audits/006-layer-priority-and-blend-policy-audit.md) | Unity-like terrain painting and Unreal-like layer blending semantics are mixed without a source rule |
| 007 | [Render Material Consumer Parity audit](audits/007-render-material-consumer-parity-audit.md) | Three.js materials become the terrain identity source instead of rendering source-owned masks |
| 008 | [Audio Vfx Surface Consumer Parity audit](audits/008-audio-vfx-surface-consumer-parity-audit.md) | footstep, mining, dust, hit, and ambience cues stay generic even when the terrain visually changes |
| 009 | [Placement Biome Filter Parity audit](audits/009-placement-biome-filter-parity-audit.md) | rocks, plants, rails, camps, and gold props scatter from renderer geometry rather than authored surface intent |
| 010 | [Gameplay Zone Material Parity audit](audits/010-gameplay-zone-material-parity-audit.md) | receipts prove actions that were detached from the authored terrain surface and biome context |
| 011 | [Mask Negative Fixture Cases audit](audits/011-mask-negative-fixture-cases-audit.md) | validation only checks that a mask exists and misses broken material or biome contracts |
| 012 | [Material Biome Stale Proof audit](audits/012-material-biome-stale-proof-audit.md) | old renderer batches, object placements, or proof screenshots survive after surface identity changes |

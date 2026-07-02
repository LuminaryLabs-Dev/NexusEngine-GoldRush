# Normal And Slope Contract Audit Matrix

Status: implemented-local
Parent atom: `004-normal-and-slope-contract`

## Purpose

Track hardening audits for each normal and slope micro-step.

| ID | Audit packet | Fake-completion risk |
| --- | --- | --- |
| 001 | [Normal Vector Shape audit](audits/001-normal-vector-shape-audit.md) | movement and placement accept malformed normals that only work in renderer lighting | implemented-local |
| 002 | [Normal Space Contract audit](audits/002-normal-space-contract-audit.md) | character grounding, prop alignment, and lighting use normals from different coordinate spaces | implemented-local |
| 003 | [Slope Value Domain audit](audits/003-slope-value-domain-audit.md) | steep terrain is treated as walkable because slope values are silently clamped or ignored | implemented-local |
| 004 | [Slope Class Taxonomy audit](audits/004-slope-class-taxonomy-audit.md) | gameplay logic invents walkability labels outside the terrain source contract | implemented-local |
| 005 | [Walkable Slope Thresholds audit](audits/005-walkable-slope-thresholds-audit.md) | the player can climb mountains or gets blocked on gentle terrain because thresholds are duplicated | implemented-local |
| 006 | [Normal Derivation Source audit](audits/006-normal-derivation-source-audit.md) | renderer-generated normals become gameplay truth without source validation | implemented-local |
| 007 | [Gradient Sample Neighborhood audit](audits/007-gradient-sample-neighborhood-audit.md) | slope flips or pulses across cells because each consumer samples a different neighborhood | implemented-local |
| 008 | [Sample Ground Api Shape audit](audits/008-sample-ground-api-shape-audit.md) | height, normal, and slope are queried separately and drift between systems | implemented-local |
| 009 | [Movement Consumer Parity audit](audits/009-movement-consumer-parity-audit.md) | camera and character feel stable in proof while movement still uses hidden slope logic | implemented-local |
| 010 | [Placement Consumer Parity audit](audits/010-placement-consumer-parity-audit.md) | rocks, plants, mines, and cashout props look grounded but are aligned by renderer fallback | implemented-local |
| 011 | [Slope Negative Fixture Cases audit](audits/011-slope-negative-fixture-cases-audit.md) | validation only checks that slope exists and misses broken terrain-footing data | implemented-local |
| 012 | [Normal Slope Stale Proof audit](audits/012-normal-slope-stale-proof-audit.md) | old movement or placement caches survive after source terrain slope changes | implemented-local |

# Height Sample Contract Audit Matrix

Status: active docs-only
Parent atom: `003-height-sample-contract`

## Purpose

Track hardening audits for each height sample micro-step.

| ID | Audit packet | Fake-completion risk |
| --- | --- | --- |
| 001 | [Height Sample Array Shape audit](audits/001-height-sample-array-shape-audit.md) | terrain code accepts an irregular or empty height grid and fills gaps procedurally |
| 002 | [Height Value Domain audit](audits/002-height-value-domain-audit.md) | renderer or collider clamps invalid height data and hides source corruption |
| 003 | [Height Normalization Policy audit](audits/003-height-normalization-policy-audit.md) | render mesh and physics collider interpret the same number as different vertical positions |
| 004 | [Height Origin And Offset audit](audits/004-height-origin-and-offset-audit.md) | the character floats or sinks because the visible mesh and grounding use different base heights |
| 005 | [Cell Id And Sample Address audit](audits/005-cell-id-and-sample-address-audit.md) | debugging cannot identify which authored cell caused a bad player-footing or prop-placement result |
| 006 | [Interpolation Mode Contract audit](audits/006-interpolation-mode-contract-audit.md) | collider, renderer, and gameplay query different heights between sample points |
| 007 | [Edge Sample Policy audit](audits/007-edge-sample-policy-audit.md) | map borders create invisible ledges, holes, or fallback heights |
| 008 | [Height Query Api Shape audit](audits/008-height-query-api-shape-audit.md) | consumers call private helpers or duplicate height math outside the source kit |
| 009 | [Known Proof Points audit](audits/009-known-proof-points-audit.md) | height proof passes on arbitrary points while gameplay-critical locations remain unproven |
| 010 | [Render Collider Height Parity audit](audits/010-render-collider-height-parity-audit.md) | visual terrain and physical terrain diverge even though each has valid height samples |
| 011 | [Height Negative Fixture Cases audit](audits/011-height-negative-fixture-cases-audit.md) | validation becomes an existence check and cannot catch broken terrain source data |
| 012 | [Height Revision Stale Proof audit](audits/012-height-revision-stale-proof-audit.md) | old consumer caches survive after source terrain height changes |

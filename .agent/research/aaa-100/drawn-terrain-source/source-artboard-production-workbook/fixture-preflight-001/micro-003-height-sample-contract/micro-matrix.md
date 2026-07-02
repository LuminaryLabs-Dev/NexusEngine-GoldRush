# Height Sample Contract Micro Matrix

Status: implemented-local
Parent atom: `003-height-sample-contract`

## Purpose

Track the 12 micro-steps required before future code can safely claim the terrain fixture has usable height samples.

| ID | Micro atom | Source field | Required proof | State |
| --- | --- | --- | --- | --- |
| 001 | [Height Sample Array Shape](micro/001-height-sample-array-shape.md) | heightSamples | validator proves the fixture has a rectangular finite height array with declared width and height | implemented-local |
| 002 | [Height Value Domain](micro/002-height-value-domain.md) | heightValueDomain | validator rejects NaN, infinite, string, null, and out-of-range height samples | implemented-local |
| 003 | [Height Normalization Policy](micro/003-height-normalization-policy.md) | heightNormalization | snapshot states whether stored heights are world-space, normalized, or offset-scaled | implemented-local |
| 004 | [Height Origin And Offset](micro/004-height-origin-and-offset.md) | heightOriginOffset | sampleHeight reports source height, offset, and world height for proof points | implemented-local |
| 005 | [Cell Id And Sample Address](micro/005-cell-id-and-sample-address.md) | sourceCellId | sampleHeight returns source cell id, sample index, and fractional coordinate context | implemented-local |
| 006 | [Interpolation Mode Contract](micro/006-interpolation-mode-contract.md) | heightInterpolationMode | sampleHeight declares nearest, bilinear, barycentric, or fixed-mode interpolation | implemented-local |
| 007 | [Edge Sample Policy](micro/007-edge-sample-policy.md) | heightEdgePolicy | edge and corner sample queries have explicit accept, clamp, or reject behavior | implemented-local |
| 008 | [Height Query Api Shape](micro/008-height-query-api-shape.md) | sampleHeightApi | public API returns a serializable height hit object with finite world height and revision echo | implemented-local |
| 009 | [Known Proof Points](micro/009-known-proof-points.md) | heightProofPoints | validator checks named spawn, route, mine, cashout, and blocker sample points | implemented-local |
| 010 | [Render Collider Height Parity](micro/010-render-collider-height-parity.md) | heightConsumerParity | render, collider, raycast, and movement snapshots echo matching height values for the same proof points | implemented-local |
| 011 | [Height Negative Fixture Cases](micro/011-height-negative-fixture-cases.md) | heightNegativeCases | validator fails missing grid, bad dimensions, non-finite values, and mismatched sample counts | implemented-local |
| 012 | [Height Revision Stale Proof](micro/012-height-revision-stale-proof.md) | heightRevisionPolicy | height sample changes mark render, collider, placement, gameplay, screenshot, and public proof stale | implemented-local |

## Use Rule

Future implementation should move to `micro-004-normal-and-slope-contract` and stop if normal/slope derivation cannot consume these finite source-owned height samples.

## Local Proof

- Validator: `node tools/validation/validate-authored-terrain-fixture.mjs`
- Full gate: `npm run validate`
- Build gate: `npm run build`
- Current source revision: `rev-0f3dfa75`

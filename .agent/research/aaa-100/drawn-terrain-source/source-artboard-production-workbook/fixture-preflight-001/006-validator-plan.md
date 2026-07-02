# Validator Plan

Status: active docs-only
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Plan the future CLI validator before writing implementation code.

## Future Validator

Candidate command:

```txt
node tools/validation/validate-terrain-source-fixture.mjs
```

## Required Cases

| Case | Pass condition |
| --- | --- |
| Source identity | Fixture id and revision id are present and stable. |
| Bounds | Bounds are finite and large enough for a tiny playable slice. |
| Layer completeness | Required terrain layers exist and share dimensions or sample domain. |
| Height validity | Height samples are finite and within declared bounds. |
| Slope validity | Slope classes map to valid height/normal relationships. |
| Walkable/blocker parity | A point cannot be both freely walkable and hard blocker without a named edge case. |
| Annotation completeness | Route, mine, gold, cover, cashout, rail, and pressure annotations exist. |
| Anchor grounding | Asset anchors are tied to masks and raycastable terrain. |
| LOD coverage | Near, mid, far, and horizon cells cover the declared fixture region. |
| Consumer revision parity | Render, collider, placement, gameplay, and proof consumers report the same revision. |

## Negative Cases

- Missing revision id fails.
- Missing blocker mask fails.
- Renderer-only source fields fail.
- Collider using different samples fails.
- Prop anchor without placement mask fails.
- Proof shot without expected readable content fails.

## Stop Condition

Stop if the validator only checks that a file exists. It must reject source drift, consumer drift, missing annotations, invalid masks, and proof anchors that do not describe player-readable content.

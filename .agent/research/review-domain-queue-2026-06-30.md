# Review Domain Queue

Date: 2026-06-30
Status: active
Scope: `reports/review-queues/goldrush-dual-source-001.remaining-review-domain-queue.json`

## Intent

Convert the flat pending review surface into owner-scoped review lanes without treating queue priority as approval.

## Source Notes

- SPDX license identifiers help normalize license naming, but they are not source evidence for a specific copied asset.
- Creative Commons license families can include attribution and redistribution obligations that must be resolved per asset before public deployment.
- glTF/GLB remains the browser-ready target for model assets, so any FBX source review queue must still lead through conversion, scale/origin review, collider policy, and material review before runtime use.

Sources:

- https://spdx.org/licenses/
- https://creativecommons.org/cc-licenses/
- https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html

## Current Queue Facts

```txt
review items: 737
review domains: 43
P0 domains: 26
P1 domains: 17
public promotion: false
runtime promotion: false
```

Owner split:

```txt
world-technical-art: 9
character-combat-art: 14
audio-licensing: 4
environment-model-art: 6
environment-material-art: 10
```

## AAA Gaps

- P0/P1 priority is still based on asset role and runtime importance, not visual approval.
- The queue needs real review outcomes, attribution records, and rejection reasons before any promotion can happen.
- Model domains still need GLB conversion proof and collider/LOD policy.
- Terrain source domains still need terrain interpretation proof.
- Material domains still need PBR and color-space mapping proof.
- Audio domains still need track-level license and attribution confirmation.

## Kit Gaps

- `n:content:review-domain-queue`: owns queue snapshots, owners, priorities, and blocked gates.
- `n:content:approval-decision`: records explicit approve/reject/defer decisions with reviewer identity and evidence ids.
- `n:content:attribution-ledger`: turns approved license attribution into player-visible credits.
- `n:validation:runtime-promotion-readiness`: fails any queued asset promoted without conversion, approval, hash, and runtime path evidence.

## Validator Implications

- `validate-remaining-review-domain-queue.mjs` proves coverage and blockers only.
- A later approval validator must require explicit source evidence and reject queue-only approval.
- Public runtime proof should only be required after approved assets enter `public/assets/`.

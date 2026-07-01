# Approval Decision Packets

Status: active
Date: 2026-06-30

## Intent

GoldRush needs a reviewer-friendly approval authoring layer between pending review queues and public runtime promotion. The queue tells humans what to inspect; the decision packets capture what they decide; the promotion planner remains the only code path that can write `public/assets/` or `src/content/goldrushApprovedAssets.js`.

## External References

- SPDX License List: https://spdx.org/licenses/
- Creative Commons license overview: https://creativecommons.org/share-your-work/cclicenses/
- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html

## Why This Matters

- Shippable asset ingestion needs explicit license identity, not just a copied file and filename.
- Review evidence needs stable source hashes, output hashes, attribution fields, and reviewer notes.
- Runtime promotion must stay separate from review authoring so a mistaken review edit cannot copy bytes into the public app.
- Repo-relative paths are acceptable for review evidence; absolute local paths, browser profile paths, token-like values, and runtime paths are not acceptable in public artifacts.
- Sanitized conversion proves technical handling only; it does not prove rights, attribution, identity, art fit, or runtime readiness.

## Implemented Packet Shape

```txt
reports/approval-decisions/goldrush-dual-source-001/
├─ index.json
├─ goldrush-dual-source-001.approval-decision.audio-licensing.json
├─ goldrush-dual-source-001.approval-decision.character-combat-art.json
├─ goldrush-dual-source-001.approval-decision.environment-material-art.json
├─ goldrush-dual-source-001.approval-decision.environment-model-art.json
└─ goldrush-dual-source-001.approval-decision.world-technical-art.json
```

Each item starts with:

```txt
humanDecision: pending
licenseDecision: pending
approvalId: null
sourceEvidenceUrl: null
licenseIdentifier: null
runtimePath: forbidden
publicPromotion: false
runtimePromotion: false
```

## Domain/Kits Impact

- `asset-ingestion`: owns raw/sanitized/review/provenance/promotion boundaries.
- `approval-authoring`: new local report layer for human/license decisions.
- `runtime-promotion`: remains the only bridge into `assets/goldrush-approved/...`.
- `goldrush-audio`: can later consume approved runtime records, not pending audio review copies.
- `goldrush-world-props`: can later consume approved GLB/texture records, not raw FBX/material metadata.

## Validator Implications

- `validate-approval-decision-packets.mjs` proves 5 owner packets, 43 domains, and 737 pending items.
- It rejects filled approval ids, approved decisions, runtime paths, public promotion, runtime promotion, unsafe paths, and item coverage loss.
- `validate-approved-runtime-promotion.mjs` must still report zero approved records until packet decisions and license records are intentionally filled.
- `validate-sanitized-artifact-boundaries.mjs` must continue discovering the generator and require shared sanitizer writes.

## Remaining AAA Gaps

- Need a real reviewer workflow for filling packet decisions without hand-editing huge JSON.
- Need reviewer role ownership: audio licensing, character/combat art, environment materials, environment models, and world technical art.
- Need a later approved-record generator that consumes filled decision packets and updates the existing human-review/license-provenance packet pair safely.
- Need browser proof after any approved audio/model/texture promotion to confirm placeholders are replaced without breaking loading, memory budget, or gameplay readability.

# Approval Decision Application Preflight

Status: active
Date: 2026-06-30

## Intent

GoldRush needs a bridge between filled owner decision packets and canonical review/provenance records, but that bridge must be preflighted before anything mutates review packets or runtime assets.

## External References

- SPDX License List: https://spdx.org/licenses/
- Creative Commons license overview: https://creativecommons.org/share-your-work/cclicenses/
- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html

## Why This Matters

- SPDX gives stable short license identifiers, full names, license text, and canonical URLs, so approval packets should require a `licenseIdentifier` instead of free-form guessing.
- Creative Commons license terms make attribution, commercial use, noncommercial restrictions, no-derivatives restrictions, and share-alike restrictions explicit, so approval packets must capture attribution and use restrictions before promotion.
- OWASP file-upload guidance supports allowlisted file handling, generated/safe filenames, size/path controls, non-webroot storage, and layered validation, so raw imports stay out of runtime and public promotion remains a separate explicit gate.
- A reviewer-facing packet can be human-editable, but a machine preflight must still validate matching hashes, source evidence, license evidence, approval id format, and promotion blockers.

## Implemented Preflight

```txt
tools/import-sanitize/plan-approval-decision-application.mjs
tools/validation/validate-approval-decision-application-plan.mjs
tools/validation/validate-approval-decision-approved-fixture.mjs
reports/approval-decisions/goldrush-dual-source-001/application-plan.json
```

Current proof:

```txt
decisionItems: 737
pending: 737
approvedReady: 0
rejectedReady: 0
blocked: 0
invalid: 0
publicPromotion: false
runtimePromotion: false
```

Approved-ready fixture proof:

```txt
decisionItems: 737
pending: 736
approvedReady: 1
nextGate: approved-runtime-promotion-planner
publicPromotion: false
runtimePromotion: false
canonical packets mutated: false
fixture retained: false
```

## Rules

- The preflight is report-only and does not mutate human-review or license-provenance packets.
- Approved-ready decisions require `humanDecision: approved`, `licenseDecision: approved`, a `goldrush-approval-*` id, HTTPS source evidence, and a license identifier.
- Attribution text is required when `attributionRequired` is true.
- Rejected-ready decisions can be represented without public/runtime promotion.
- Pending decisions must remain no-op.
- Runtime paths remain forbidden in decision and application reports.
- Fixture approval tests must create temporary packet copies and remove them before exit.

## Kit Gaps

- `n:asset-review:decision-authoring`: future generic kit for reviewer decision state.
- `n:asset-review:decision-application`: future generic kit for applying approved decisions to canonical records.
- `n:asset-review:license-identity`: future generic kit for SPDX/CC/custom license validation and attribution requirements.
- `n:goldrush:approved-runtime-assets`: GoldRush-specific bridge from approved records into game presentation slots.

## Validator Implications

- Current validator is strict no-op proof because no real decisions are filled.
- The approved-fixture validator proves the future happy path without changing canonical review packets.
- `validate-approved-runtime-promotion.mjs` must remain the only gate that can declare runtime promotion readiness.

# Local Validation Gates for Legacy Import PRs

Local Codex can add these checks inside `LuminaryLabs-Dev/NexusEngine-GoldRush` without cloning or reading any legacy repo.

## Gate 1: no runtime references to raw imports

Fail if app/runtime files reference any of these strings:

```txt
raw/imported/
quarantine/
GoldRush_Old/
thecrimsondeveloper/Gold_Rush
```

Suggested command:

```bash
rg -n "raw/imported|quarantine|GoldRush_Old|thecrimsondeveloper/Gold_Rush" src public index.html package.json vite.config.*
```

Expected result: no matches.

## Gate 2: denied folders/files absent from destination

Fail if the destination repo contains copied Unity configs, generated folders, or plugin folders:

```bash
find . \
  -path '*/Packages/manifest.json' -o \
  -path '*/Packages/packages-lock.json' -o \
  -path '*/ProjectSettings/*' -o \
  -path '*/UserSettings/*' -o \
  -path '*/Library/*' -o \
  -path '*/Temp/*' -o \
  -path '*/Obj/*' -o \
  -path '*/Logs/*' -o \
  -path '*/Build/*' -o \
  -path '*/Builds/*' -o \
  -path '*/Assets/Photon/*' -o \
  -path '*/Assets/Photon*/*' -o \
  -path '*/Assets/Plugins/*'
```

Expected result: no matches, except docs/report text that names blocked paths for policy reasons.

## Gate 3: public artifacts must be sanitized

Fail if docs contain token-like strings or reports/manifests contain private machine paths, browser profile details, or token-like values:

```bash
node tools/validation/validate-report-secrets.mjs
```

Expected result: `report secrets passed`.

Fail if proof, simulator, or active remaining-batch import tools bypass the shared sanitizer for retained JSON or console summaries:

```bash
node tools/validation/validate-sanitized-artifact-boundaries.mjs
```

Expected result: `sanitized-artifact-boundaries-ready`.

## Gate 4: public assets require approval

Fail if `public/assets/` contains non-placeholder files that are not listed in an approval/registry report.

Suggested policy:

```txt
public/assets/** requires a matching assetId and approval record before merge.
```

Validate the explicit promotion planner before the approved registry gate:

```bash
node tools/validation/validate-approved-runtime-promotion.mjs
node tools/validation/validate-approved-asset-registry.mjs
```

Expected result before approvals: `approved-runtime-promotion-gate-ready` with `approvedRecords: 0`, blocked pending review items, and `runtimePromotion: false`.

## Gate 4A: cloud asset receipts must agree

Fail if raw candidates exist without the full receipt set, if receipt JSON has the wrong schema, if denied paths were copied, if source discovery does not prove both Unity roots, or if secret scans expose secret values:

```bash
node tools/validation/validate-cloud-asset-receipts.mjs
```

Expected result before import: `waiting-for-cloud-asset-receipts`.
Expected result after cloud raw copy: `cloud-asset-receipts-ready`.

Import branches use strict mode so empty or receipt-free cloud branches fail:

```bash
node tools/validation/validate-cloud-asset-receipts.mjs --require-receipts
```

## Gate 4B: remaining audio conversion must stay review-only

Fail if the first remaining audio batch is copied to sanitized output without preserving receipt scope, hashes, no-promotion flags, and review gates:

```bash
node tools/validation/validate-remaining-audio-conversion.mjs
```

Expected result after conversion: `remaining-audio-conversion-ready` with 15 outputs, 90,145,108 bytes, and `publicPromotion: false`.

## Gate 4C: remaining audio review/provenance must stay pending until approved

Fail if the first remaining audio batch has sanitized outputs but lacks review packets, license provenance packets, no-promotion flags, safe evidence paths, or pending approval state:

```bash
node tools/validation/validate-remaining-audio-review-packets.mjs
```

Expected result after packet generation: `remaining-audio-review-packets-ready` with 15 review items, 15 pending human reviews, 15 pending license reviews, and `publicPromotion: false`.

## Gate 4D: remaining player/combat conversion must stay review-only

Fail if the copied player/combat batch lacks sanitized review outputs, writes runtime paths, skips external conversion requests for FBX files, or claims promotion:

```bash
node tools/validation/validate-remaining-player-combat-conversion.mjs
```

Expected result after conversion: `remaining-player-combat-conversion-ready` with 36 outputs, 3 texture review copies, 24 metadata extracts, 9 external conversion requests, and `runtimePromotion: false`.

## Gate 4E: remaining mine/town/terrain texture conversion must stay review-only

Fail if the copied mine/town/terrain prop texture batch lacks sanitized image review outputs, writes runtime paths, skips role classification, loses hashes, or claims promotion:

```bash
node tools/validation/validate-remaining-mine-town-terrain-props-conversion.mjs
```

Expected result after conversion: `remaining-mine-town-terrain-props-conversion-ready` with 125 texture review copies, 189,766,893 output bytes, 0 promotion-ready assets, and `runtimePromotion: false`.

## Gate 4F: remaining mine/town/terrain model conversion must stay review-only

Fail if the copied mine/town/terrain prop model batch lacks image review copies, prefab metadata extracts, FBX external conversion requests, role classification, no-promotion flags, or safe report paths:

```bash
node tools/validation/validate-remaining-mine-town-terrain-prop-models-conversion.mjs
```

Expected result after conversion: `remaining-mine-town-terrain-prop-models-conversion-ready` with 125 outputs, 15 image review copies, 79 prefab metadata extracts, 31 external conversion requests, 7 roles, 0 promotion-ready assets, and `runtimePromotion: false`.

## Gate 4G: remaining mine/town/terrain source metadata must stay review-only

Fail if the final four mine/town/terrain source batches lack material metadata extracts, terrain asset metadata extracts, FBX external conversion requests, role classification, no-promotion flags, or safe report paths:

```bash
node tools/validation/validate-remaining-mine-town-terrain-source-metadata-conversion.mjs
```

Expected result after conversion: `remaining-mine-town-terrain-source-metadata-conversion-ready` with 4 batches, 436 outputs, 392 metadata extracts, 44 external conversion requests, 9 roles, 0 promotion-ready assets, and `runtimePromotion: false`.

## Gate 4H: remaining non-audio review/provenance packets must stay pending

Fail if the grouped non-audio review packet is missing, maps to the wrong conversion outputs, contains filled approval IDs, writes runtime paths, claims approved status, or skips license/human review gates:

```bash
node tools/validation/validate-remaining-non-audio-review-packets.mjs
```

Expected result after packet generation: `remaining-non-audio-review-packets-ready` with 722 review items, 39 domains, 722 pending human reviews, 722 pending license reviews, and `runtimePromotion: false`.

## Gate 4I: remaining review domain queue must cover every pending item

Fail if the grouped review queue is missing, loses any pending audio or non-audio item, skips owner/priority assignment, lacks license/human/runtime blockers, or implies approval:

```bash
node tools/validation/validate-remaining-review-domain-queue.mjs
```

Expected result after queue generation: `remaining-review-domain-queue-ready` with 737 review items, 43 review domains, P0/P1 priority split, owner lanes, and `runtimePromotion: false`.

## Gate 4J: approval decision packets must stay pending-only

Fail if owner-scoped approval packets are missing, lose item coverage, include filled approval ids, include runtime paths, contain approved decisions, or imply public/runtime promotion:

```bash
node tools/validation/validate-approval-decision-packets.mjs
```

Expected result after packet generation: `approval-decision-packets-ready` with 5 owner packets, 43 review domains, 737 review items, 737 pending human decisions, 737 pending license decisions, and `runtimePromotion: false`.

## Gate 4K: approval decision application preflight must be no-op until approvals exist

Fail if the application preflight report is missing, mutates review packets, claims public/runtime promotion, contains filled approval IDs, or reports approved-ready items before real decisions are filled:

```bash
node tools/validation/validate-approval-decision-application-plan.mjs
```

Expected result now: `approval-decision-application-plan-ready` with 737 pending decisions, 0 approved-ready, 0 rejected-ready, and `runtimePromotion: false`.

## Gate 4L: approval decision approved fixture must not promote assets

Fail if the temporary approved-decision fixture mutates canonical review packets, leaves fixture files behind, creates runtime paths, or promotes public/runtime assets:

```bash
node tools/validation/validate-approval-decision-approved-fixture.mjs
```

Expected result now: `approval-decision-approved-fixture-ready` with 737 decision items, 736 pending, 1 approved-ready, `nextGate: approved-runtime-promotion-planner`, and `runtimePromotion: false`.

## Gate 5: static build must not include raw import folders

After build, fail if `dist/` includes import working folders, source-only asset references, local machine paths, file URLs, or path traversal into non-runtime folders:

```bash
npm run build
node tools/validation/validate-public-build-artifacts.mjs
```

Expected result: `public-build-artifacts-sanitized`. This validator is also wired as `postbuild`, so `npm run build` runs it automatically after Vite emits `dist/`.

## Gate 6: Pages base path

For GitHub Pages under the repo path, the Vite base path should resolve to:

```txt
/NexusEngine-GoldRush/
```

The Build branch should contain generated static output only.

## Gate 7: public Pages smoke proof

After Pages deploys, prove the public URL reaches the player-visible flow:

```bash
npm run proof:public -- --url https://luminarylabs-dev.github.io/NexusEngine-GoldRush/
```

Expected result: title -> lobby -> loading-yard train -> run scene, 20-player match, active `site.gold-field`, loaded `procedural-terrain` kit group, camera-relative WASD, visible-band terrain raycast, `cannon-es` terrain physics, and passing reality validation.

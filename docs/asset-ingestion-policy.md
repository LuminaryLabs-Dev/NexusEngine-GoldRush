# Asset Ingestion Policy

## Rule

Legacy assets are moved by GPT-it/cloud/GitHub-side work into this repository. Local work does not clone source repositories.

## Allowed Flow

```txt
external legacy repo
-> cloud transfer
-> raw/imported/<jobId>/
-> quarantine scan
-> provenance record
-> sanitized/converted/<jobId>/
-> batch-scoped sanitized review outputs when needed
-> human review
-> public/assets/
```

## Blocked By Default

- Unity `Library/`, `Temp/`, `Obj/`, `Build/`, and generated project files.
- `ProjectSettings/`, `UserSettings/`, package manifests, lock files, and registry config.
- Photon/Fusion app settings, secrets, tokens, and cloud config.
- Third-party plugin folders unless provenance explicitly permits redistribution.
- C# scripts as browser runtime code.

## Promotion Requirement

Every promoted asset needs:

- source job id.
- source path.
- source hash.
- output hash.
- provenance status.
- human approval id.
- browser runtime path.

Approved runtime metadata lands in:

```txt
src/content/goldrushApprovedAssets.js
```

Approved bytes land in:

```txt
public/assets/
```

The browser consumes only `assets/...` runtime paths after the approved overlay replaces matching placeholder slots. Runtime code must never import from `raw/`, `sanitized/`, or `quarantine/`.

Local validation:

```txt
node tools/validation/validate-approved-asset-registry.mjs
```

## Approved Runtime Promotion

Sanitized review outputs do not become game assets by themselves. Promotion is a separate explicit step:

```txt
human review approved
+ license provenance approved
+ matching approval id
+ sanitized output hash match
+ safe assets/... runtime path
-> public/assets/goldrush-approved/
-> public/assets/manifests/goldrush-assets.json
-> src/content/goldrushApprovedAssets.js
```

Current planner and gate:

```txt
node tools/import-sanitize/promote-approved-runtime-assets.mjs
node tools/validation/validate-approved-runtime-promotion.mjs
```

Default mode is a dry-run and report-only. Runtime writes require both:

```txt
--write
--confirm-approved-runtime-promotion
```

The current expected state is `no-approved-assets-to-promote`: all 768 copied/reviewed items remain blocked because human review and license provenance are still pending. The planner must not infer approval from filenames, source repo presence, sanitized conversion, or review queue priority.

## Approval Decision Packets

Review queues are not approvals. Owner-scoped approval decision packets provide editable human-review surfaces while preserving the deny-by-default runtime boundary:

```txt
node tools/import-sanitize/generate-approval-decision-packets.mjs --write
node tools/validation/validate-approval-decision-packets.mjs
```

Current output:

```txt
reports/approval-decisions/goldrush-dual-source-001/index.json
reports/approval-decisions/goldrush-dual-source-001/goldrush-dual-source-001.approval-decision.audio-licensing.json
reports/approval-decisions/goldrush-dual-source-001/goldrush-dual-source-001.approval-decision.character-combat-art.json
reports/approval-decisions/goldrush-dual-source-001/goldrush-dual-source-001.approval-decision.environment-material-art.json
reports/approval-decisions/goldrush-dual-source-001/goldrush-dual-source-001.approval-decision.environment-model-art.json
reports/approval-decisions/goldrush-dual-source-001/goldrush-dual-source-001.approval-decision.world-technical-art.json
```

The packets cover 737 remaining review items across 43 domains and 5 owner lanes. Every item starts with pending human/license decisions, null approval id, no runtime path, `publicPromotion: false`, and `runtimePromotion: false`. They may retain repo-relative review evidence paths, including `raw/imported/...` evidence paths, but they must not include absolute local paths, browser-profile paths, secret-like values, or any `runtimePath`.

Promotion still requires the separate promotion planner after both human and license decisions are approved with matching approval ids. A filled decision packet is therefore approval evidence, not public runtime output.

## Approval Decision Application Preflight

Filled decision packets still do not mutate review/provenance packets directly. The application preflight reads the owner packets and writes a sanitized no-op or ready-update report:

```txt
node tools/import-sanitize/plan-approval-decision-application.mjs --write
node tools/validation/validate-approval-decision-application-plan.mjs
```

Current output:

```txt
reports/approval-decisions/goldrush-dual-source-001/application-plan.json
```

Current expected state is `approval-decision-application-noop`: 737 decisions remain pending, 0 are approved-ready, 0 are rejected-ready, and the canonical human-review/license-provenance packets remain unchanged. Future approved-ready decisions must include approved human and license decisions, a matching `goldrush-approval-*` id, HTTPS source evidence, a license identifier, and attribution text when attribution is required.

The future approved path is validated with a temporary fixture, not by editing canonical packets:

```txt
node tools/validation/validate-approval-decision-approved-fixture.mjs
```

This creates one temporary approved audio decision, proves 1 approved-ready item and 736 pending items, routes the next step to the approved runtime promotion planner, keeps `publicPromotion: false` and `runtimePromotion: false`, forbids `runtimePath`, and deletes the fixture folder when finished.

## Sanitized By Default

Import/sanitize tooling may write raw asset bytes only to `raw/imported/<jobId>/`. Any retained proof, receipt, review, provenance, report, registry, Markdown, or console summary must use the shared public artifact sanitizer so local machine paths, browser profiles, account emails, token-like values, and secret query parameters are redacted before they become repo artifacts.

Current enforced helper boundary:

```txt
tools/safety/publicArtifactSanitizer.mjs
tools/validation/validate-sanitized-artifact-boundaries.mjs
tools/validation/validate-report-secrets.mjs
```

All import/sanitize scripts are now discovered by the sanitizer boundary validator. Retained proof/receipt/review/provenance/conversion/registry/queue JSON must use `writeSanitizedJsonArtifactSync`, and JSON summaries must use `sanitizedConsoleJson`. Raw asset bytes remain direct writes because they are quarantined evidence, not public runtime content. Sanitized binary review copies may be written as bytes, but `.json` outputs generated through byte helpers must branch back through the sanitizer before persistence.

For remaining copied audio batches, sanitized conversion is batch-scoped so it does not mutate the first 31-file conversion gate:

```txt
node tools/import-sanitize/convert-remaining-audio-batch.mjs --write
node tools/validation/validate-remaining-audio-conversion.mjs
node tools/import-sanitize/create-remaining-audio-review-packets.mjs --write
node tools/validation/validate-remaining-audio-review-packets.mjs
```

This writes browser-ready MP3/OGG/WAV review copies under `sanitized/converted/.../remaining-batches/` and a registry under `sanitized/registry/remaining-batches/`. These files remain blocked from runtime until license provenance, human review, approved runtime metadata, and `public/assets/` hash validation all pass.

For remaining player/combat batches, raw source candidates stay isolated by batch, and conversion creates only review-safe artifacts:

```txt
node tools/import-sanitize/copy-remaining-batch-from-github.mjs --batch goldrush-dual-source-001.next.002.player-combat-character --fetch --proof-out reports/provenance/goldrush-dual-source-001-next-002-fetch-proof.json
node tools/import-sanitize/copy-remaining-batch-from-github.mjs --batch goldrush-dual-source-001.next.002.player-combat-character --write --confirm-public-raw-import-risk --proof-out reports/provenance/goldrush-dual-source-001-next-002-raw-write-proof.json
node tools/import-sanitize/generate-remaining-batch-receipts.mjs --batch goldrush-dual-source-001.next.002.player-combat-character --write
node tools/import-sanitize/convert-remaining-player-combat-batch.mjs --write
node tools/validation/validate-remaining-player-combat-conversion.mjs
```

This produces texture review copies, Unity metadata JSON, and FBX external-conversion request JSON only. It does not convert FBX to runtime GLB, does not write `public/assets/`, and does not approve any character, weapon, or animation slot.

For remaining mine/town/terrain prop texture batches, raw image candidates stay isolated by batch, and conversion creates review copies only:

```txt
node tools/import-sanitize/copy-remaining-batch-from-github.mjs --batch goldrush-dual-source-001.next.003.mine-town-terrain-props --write --confirm-public-raw-import-risk --proof-out reports/provenance/goldrush-dual-source-001-next-003-raw-write-proof.json
node tools/import-sanitize/generate-remaining-batch-receipts.mjs --batch goldrush-dual-source-001.next.003.mine-town-terrain-props --write
node tools/import-sanitize/convert-remaining-mine-town-terrain-props-batch.mjs --write
node tools/validation/validate-remaining-mine-town-terrain-props-conversion.mjs
```

This produces `.jpg`/`.png` texture review copies, role classification, color-space hints, dimensions, and future KTX2/compression recommendations. It does not write `public/assets/`, does not approve any terrain, town, train, cart, fence, plant, rock, UI, or legacy-character material slot, and does not make renderer/runtime imports legal.

For remaining mine/town/terrain prop model batches, raw FBX/prefab/image candidates stay isolated by batch, and conversion creates only review artifacts:

```txt
node tools/import-sanitize/copy-remaining-batch-from-github.mjs --batch goldrush-dual-source-001.next.004.mine-town-terrain-props --write --confirm-public-raw-import-risk --proof-out reports/provenance/goldrush-dual-source-001-next-004-raw-write-proof.json
node tools/import-sanitize/generate-remaining-batch-receipts.mjs --batch goldrush-dual-source-001.next.004.mine-town-terrain-props --write
node tools/import-sanitize/convert-remaining-mine-town-terrain-prop-models-batch.mjs --write
node tools/validation/validate-remaining-mine-town-terrain-prop-models-conversion.mjs
```

This produces image review copies, prefab metadata extracts, and FBX external-conversion request descriptors only. It does not convert FBX to runtime GLB, does not write `public/assets/`, and does not approve any train, rail, town, flora, rock, mine-cart, utility, or character-reference prop slot.

For the final remaining mine/town/terrain material and terrain source batches, raw `.fbx`, `.mat`, and `.asset` candidates stay isolated by batch, and conversion creates only grouped metadata review artifacts:

```txt
node tools/import-sanitize/copy-remaining-batch-from-github.mjs --batch goldrush-dual-source-001.next.005.mine-town-terrain-props --write --confirm-public-raw-import-risk --proof-out reports/provenance/goldrush-dual-source-001-next-005-raw-write-proof.json
node tools/import-sanitize/copy-remaining-batch-from-github.mjs --batch goldrush-dual-source-001.next.006.mine-town-terrain-props --write --confirm-public-raw-import-risk --proof-out reports/provenance/goldrush-dual-source-001-next-006-raw-write-proof.json
node tools/import-sanitize/copy-remaining-batch-from-github.mjs --batch goldrush-dual-source-001.next.007.mine-town-terrain-props --write --confirm-public-raw-import-risk --proof-out reports/provenance/goldrush-dual-source-001-next-007-raw-write-proof.json
node tools/import-sanitize/copy-remaining-batch-from-github.mjs --batch goldrush-dual-source-001.next.008.mine-town-terrain-props --write --confirm-public-raw-import-risk --proof-out reports/provenance/goldrush-dual-source-001-next-008-raw-write-proof.json
node tools/import-sanitize/generate-remaining-batch-receipts.mjs --batch <batch-id> --write
node tools/import-sanitize/convert-remaining-mine-town-terrain-source-metadata-batches.mjs --write
node tools/validation/validate-remaining-mine-town-terrain-source-metadata-conversion.mjs
```

This produces material metadata extracts, terrain asset metadata extracts, and FBX external-conversion request descriptors only. It does not translate Unity materials into approved Three.js/PBR materials, does not interpret Unity terrain assets into runtime terrain data, does not write `public/assets/`, and does not approve any runtime slot.

For remaining non-audio review outputs, grouped review/provenance packets make the next approval step explicit while keeping promotion blocked:

```txt
node tools/import-sanitize/create-remaining-non-audio-review-packets.mjs --write
node tools/validation/validate-remaining-non-audio-review-packets.mjs
```

This writes a pending human-review request and pending license-provenance packet for player/combat, prop texture, prefab metadata, FBX conversion, material metadata, and terrain source outputs. It does not fill approval IDs, does not create runtime paths, does not write `public/assets/`, and does not make any asset playable.

## Current Intake Bridge

`engine.n.goldrushLegacySources` exposes a browser-safe summary of the two legacy Unity source projects and the required playable asset families. The concrete cloud-worker request is:

```txt
manifests/import-jobs/goldrush-legacy-source-intake.json
```

Local validation for this bridge is:

```txt
node tools/validation/validate-legacy-source-intake.mjs
```

## Destination Repo Classifier

After a private/cloud worker copies approved candidates into `raw/imported/<jobId>/`, classify the candidate set inside this repo before conversion or promotion:

```txt
node tools/import-sanitize/classify-goldrush-import.mjs --job goldrush-dual-source-001
node tools/validation/validate-asset-intake-classifier.mjs
```

The classifier maps likely legacy files to Gold Rush slot IDs, blocks package/settings/plugin/secret-like files, and reports unmapped files without promoting anything. The job manifest is:

```txt
manifests/import-jobs/goldrush-asset-intake-classifier.json
```

## Cloud Transfer Handoff

The executable cloud-worker packet is:

```txt
manifests/import-jobs/goldrush-cloud-transfer-handoff.json
```

It defines the source repository, two Unity roots, required scene evidence, denied path patterns, domain-based copy priorities, edge cases, destination folders, report outputs, and acceptance criteria.

Local validation:

```txt
node tools/validation/validate-cloud-transfer-handoff.mjs
```

This validator checks that every required legacy playable slot is present in both the handoff packet and the runtime slot registry. It also verifies that the packet keeps local Codex out of legacy source clones and requires public smoke proof after promotion.

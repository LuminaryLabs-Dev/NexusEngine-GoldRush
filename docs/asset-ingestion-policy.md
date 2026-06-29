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

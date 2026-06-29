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

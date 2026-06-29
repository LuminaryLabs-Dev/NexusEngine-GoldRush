# Cloud Asset Receipt Contract

Status: active gate
Validator: `node tools/validation/validate-cloud-asset-receipts.mjs`
Import job: `goldrush-dual-source-001`

## Purpose

Cloud workers may inspect old Gold Rush Unity repositories and copy safe candidates into `NexusEngine-GoldRush`. Local Codex still must not clone or inspect the old repos. This contract defines the receipt files that prove a cloud copy is reviewable before conversion, approval, or runtime promotion.

## Required Receipts

```txt
reports/provenance/goldrush-dual-source-001-source-discovery.json
quarantine/reports/goldrush-dual-source-001-deny-path-scan.json
reports/secret-scans/goldrush-dual-source-001.json
reports/provenance/goldrush-dual-source-001-copy-ledger.json
reports/provenance/goldrush-dual-source-001-hashes.json
reports/asset-classification/goldrush-dual-source-001-classification.json
```

If none of these files and no raw candidate files exist, the validator reports `waiting-for-cloud-asset-receipts`. If any receipt or raw candidate exists, all required receipts become mandatory.

## Source Discovery Shape

```json
{
  "schema": "nexusengine.goldrush.cloud-source-discovery.v1",
  "importJobId": "goldrush-dual-source-001",
  "source": {
    "nameWithOwner": "thecrimsondeveloper/Gold_Rush",
    "commitSha": "40-char-git-sha",
    "roots": [
      {
        "sourceKey": "goldrush-modern-unity",
        "root": "GoldRush/",
        "exists": true,
        "productName": "GoldRush",
        "unityVersion": "6000.0.37f1",
        "requiredSceneEvidence": [
          { "path": "GoldRush/Assets/Scenes/Lobby.unity", "exists": true }
        ]
      }
    ]
  }
}
```

## Deny Scan Shape

```json
{
  "schema": "nexusengine.goldrush.deny-path-scan.v1",
  "importJobId": "goldrush-dual-source-001",
  "status": "passed",
  "blockedPaths": []
}
```

Denied paths include Unity package manifests/locks, generated Unity folders, Photon/Fusion config, plugin folders, solution/project files, and local credential files. A `blocked` status is allowed only before raw candidate copy; it must not accompany copied denied files.

## Secret Scan Shape

```json
{
  "schema": "nexusengine.goldrush.secret-scan.v1",
  "importJobId": "goldrush-dual-source-001",
  "status": "passed",
  "findings": [
    {
      "path": "GoldRush/Assets/Example.asset",
      "type": "secret-key-name"
    }
  ]
}
```

Findings must never include a secret value. Only redacted path and finding type are allowed.

## Copy Ledger Shape

```json
{
  "schema": "nexusengine.goldrush.copy-ledger.v1",
  "importJobId": "goldrush-dual-source-001",
  "copiedFiles": [
    {
      "sourcePath": "GoldRush_Old/Assets/_GOLDRUSH/Audio/Wandering Theme.wav",
      "destinationPath": "raw/imported/goldrush-dual-source-001/GoldRush_Old/Assets/_GOLDRUSH/Audio/Wandering Theme.wav",
      "sourceHash": "sha256:64-lowercase-hex",
      "sizeBytes": 12345,
      "domain": "audio"
    }
  ]
}
```

Every destination path must stay under `raw/imported/goldrush-dual-source-001/`.

## Hash Manifest Shape

```json
{
  "schema": "nexusengine.goldrush.hash-manifest.v1",
  "importJobId": "goldrush-dual-source-001",
  "files": [
    {
      "path": "raw/imported/goldrush-dual-source-001/GoldRush/Assets/Scenes/Arena.unity",
      "sha256": "sha256:64-lowercase-hex"
    }
  ]
}
```

## Classification Shape

The classification report must use:

```txt
nexusengine.goldrush.asset-intake-classification.v1
```

It must be produced by or match `tools/import-sanitize/goldrush-asset-intake-classifier.mjs`. Every candidate must require `human-review` before promotion.

## Acceptance

```bash
node tools/validation/validate-cloud-asset-receipts.mjs
npm run check
```

Passing this gate does not approve runtime assets. It only proves the raw copy is scan-backed, receipt-backed, and ready for conversion/review.

## Strict Import Branch Mode

Import branches and PRs must require receipts even when no raw files exist yet:

```bash
node tools/validation/validate-cloud-asset-receipts.mjs --require-receipts
```

The GitHub workflow `.github/workflows/validate-cloud-import.yml` runs this mode on `import/goldrush-dual-source-001-*` branches and import-related pull requests.

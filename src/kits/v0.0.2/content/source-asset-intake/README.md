# n:content:source-asset-intake

Status: v0.0.2 architecture scaffold

## Purpose

Source Asset Intake kit for GoldRush FBX asset ingestion, staging, and provenance tracking.

## Ownership

- Domain: `content`
- Subdomain: `source-asset-intake`
- Kind: `host-support`
- Proof group: `content`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:runtime:registry`
- `n:runtime:events`

## Core Kit Reuse

- `core-data-kit`
- `core-diagnostics-kit`
- `core-composition-kit`

## Boundary

This kit records source packs, staging identity, and import job metadata. It does not create runtime assets or promote files to `public/assets`.

## Example Input

```json
{
  "command": "register-source-pack",
  "sourcePackId": "quaternius-modular-train-pack",
  "sourceUrl": "https://quaternius.com/packs/modulartrain.html",
  "mirrorUrl": "https://poly.pizza/bundle/Modular-Train-Pack-jYEybkFVr1",
  "stagingRoot": "external/asset-intake/quaternius-modular-train-pack",
  "assetKinds": [
    "blend",
    "fbx",
    "obj"
  ],
  "importJobId": "goldrush-train-import-001"
}
```

## Example Output

```json
{
  "domainPath": "n:content:source-asset-intake",
  "health": "registered",
  "sourcePackId": "quaternius-modular-train-pack",
  "fileCount": 59
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "content",
  "subdomain": "source-asset-intake",
  "installed": false,
  "resetCount": 1,
  "sourcePackId": null
}
```

## First Proof

Confirm the source-candidate manifest exists, the content validator passes, and no raw `.fbx` file is referenced from runtime or public paths.

# n:content:source-file-inventory

Status: v0.0.2 architecture scaffold

## Purpose

Source File Inventory kit for GoldRush FBX asset ingestion, staging, and provenance tracking.

## Ownership

- Domain: `content`
- Subdomain: `source-file-inventory`
- Kind: `host-support`
- Proof group: `content`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:content:source-asset-intake`
- `n:content:license-provenance`

## Core Kit Reuse

- `core-data-kit`
- `core-diagnostics-kit`
- `core-composition-kit`

## Boundary

This kit hashes and inventories source files. It does not convert, approve, or promote assets.

## Example Input

```json
{
  "command": "inventory-source-files",
  "sourcePackId": "quaternius-modular-train-pack",
  "stagingRoot": "external/asset-intake/quaternius-modular-train-pack",
  "trackedExtensions": [
    "blend",
    "fbx",
    "obj",
    "mtl",
    "txt",
    "png"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:content:source-file-inventory",
  "health": "registered",
  "fileCount": 59,
  "extensionCount": 6
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "content",
  "subdomain": "source-file-inventory",
  "installed": false,
  "resetCount": 1,
  "fileCount": 0
}
```

## First Proof

Confirm the content validator passes, the Quaternius train pack file totals are recorded, and source files stay outside runtime paths.

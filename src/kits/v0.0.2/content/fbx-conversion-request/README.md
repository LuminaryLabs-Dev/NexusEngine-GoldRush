# n:content:fbx-conversion-request

Status: v0.0.2 architecture scaffold

## Purpose

FBX Conversion Request kit for GoldRush FBX asset ingestion, staging, and provenance tracking.

## Ownership

- Domain: `content`
- Subdomain: `fbx-conversion-request`
- Kind: `host-support`
- Proof group: `content`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:content:source-file-inventory`
- `n:content:license-provenance`

## Core Kit Reuse

- `core-data-kit`
- `core-diagnostics-kit`
- `core-composition-kit`

## Boundary

This kit only requests conversions. It does not execute conversion, promote GLB output, or load runtime assets.

## Example Input

```json
{
  "command": "request-conversion",
  "sourcePackId": "quaternius-modular-train-pack",
  "targetFormat": "glb",
  "selectedFiles": [
    "FBX/Locomotive_Front.fbx",
    "FBX/Locomotive_Wagon.fbx",
    "FBX/RailwayTrack_Straight.fbx"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:content:fbx-conversion-request",
  "health": "registered",
  "taskCount": 3,
  "targetFormat": "glb"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "content",
  "subdomain": "fbx-conversion-request",
  "installed": false,
  "resetCount": 1,
  "taskCount": 0
}
```

## First Proof

Confirm the content validator passes, the request packet names the selected FBX files, and no runtime promotion is implied.

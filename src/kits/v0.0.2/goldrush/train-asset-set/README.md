# n:goldrush:train-asset-set

Status: v0.0.2 architecture scaffold

## Purpose

Train Asset Set kit for GoldRush-specific train source ingestion, staging, and composition.

## Ownership

- Domain: `goldrush`
- Subdomain: `train-asset-set`
- Kind: `composite-domain`
- Proof group: `goldrush-integrated`
- Promotion status: `game-specific-v002`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:content:source-asset-intake`
- `n:content:license-provenance`
- `n:content:source-file-inventory`
- `n:content:fbx-conversion-request`

## Core Kit Reuse

- `core-composition-kit`
- `core-data-kit`
- `core-diagnostics-kit`
- `core-scene-kit`
- `core-graphics-kit`

## Boundary

This kit composes source and conversion metadata into the GoldRush train composition plan. It does not directly load raw FBX files at runtime.

## Example Input

```json
{
  "command": "compose-train-asset-set",
  "sourcePackId": "quaternius-modular-train-pack",
  "selectedFamilies": [
    "Locomotive_Front",
    "Locomotive_Wagon",
    "RailwayTrack_Straight"
  ],
  "runtimeTarget": "glb-only"
}
```

## Example Output

```json
{
  "domainPath": "n:goldrush:train-asset-set",
  "health": "registered",
  "selectedFamilies": 3,
  "runtimeTarget": "glb-only"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "goldrush",
  "subdomain": "train-asset-set",
  "installed": false,
  "resetCount": 1,
  "selectedFamilies": 0
}
```

## First Proof

Confirm the train asset set appears in the registry, composes the four content intake kits, and still keeps raw FBX out of runtime.

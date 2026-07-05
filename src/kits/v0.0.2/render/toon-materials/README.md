# n:render:toon-materials

Status: v0.0.2 architecture scaffold

## Purpose

Toon Materials kit for renderer descriptors and presentation adapters. It consumes descriptors and never owns gameplay truth.

## Ownership

- Domain: `render`
- Subdomain: `toon-materials`
- Kind: `renderer-adapter`
- Proof group: `render`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:render:three-scene`

## Core Kit Reuse

- `core-graphics-kit`
- `core-camera-kit`
- `core-diagnostics-kit`

## Boundary

This renderer adapter consumes descriptors and must not own gameplay truth.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:render:toon-materials",
  "upstreamSnapshots": [
    "n:render:three-scene"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:render:toon-materials",
  "health": "registered",
  "proofGroup": "render"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "render",
  "subdomain": "toon-materials",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

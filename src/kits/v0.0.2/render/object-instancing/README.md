# n:render:object-instancing

Status: v0.0.2 architecture scaffold

## Purpose

Object Instancing kit for renderer descriptors and presentation adapters. It consumes descriptors and never owns gameplay truth.

## Ownership

- Domain: `render`
- Subdomain: `object-instancing`
- Kind: `renderer-adapter`
- Proof group: `render`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:world:placement`

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
  "domainPath": "n:render:object-instancing",
  "upstreamSnapshots": [
    "n:world:placement"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:render:object-instancing",
  "health": "registered",
  "proofGroup": "render"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "render",
  "subdomain": "object-instancing",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

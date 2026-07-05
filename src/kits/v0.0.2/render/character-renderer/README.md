# n:render:character-renderer

Status: v0.0.2 architecture scaffold

## Purpose

Character Renderer kit for renderer descriptors and presentation adapters. It consumes descriptors and never owns gameplay truth.

## Ownership

- Domain: `render`
- Subdomain: `character-renderer`
- Kind: `renderer-adapter`
- Proof group: `render`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:animation:animation-state`
- `n:behavior:body-state`

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
  "domainPath": "n:render:character-renderer",
  "upstreamSnapshots": [
    "n:animation:animation-state",
    "n:behavior:body-state"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:render:character-renderer",
  "health": "registered",
  "proofGroup": "render"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "render",
  "subdomain": "character-renderer",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

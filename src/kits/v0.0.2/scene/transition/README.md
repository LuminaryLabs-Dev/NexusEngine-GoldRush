# n:scene:transition

Status: v0.0.2 architecture scaffold

## Purpose

Transition kit for scene site loading and transitions.

## Ownership

- Domain: `scene`
- Subdomain: `transition`
- Kind: `scoped-domain`
- Proof group: `scene`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:runtime:registry`
- `n:runtime:events`

## Core Kit Reuse

- `core-scene-kit`
- `core-composition-kit`
- `core-diagnostics-kit`

## Boundary

This kit owns only its domain/subdomain contract and composes upstream kits through snapshots.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:scene:transition",
  "upstreamSnapshots": [
    "n:runtime:registry",
    "n:runtime:events"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:scene:transition",
  "health": "registered",
  "proofGroup": "scene"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "scene",
  "subdomain": "transition",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

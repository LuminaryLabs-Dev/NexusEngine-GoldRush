# n:physics:world

Status: v0.0.2 architecture scaffold

## Purpose

World kit for physics world, colliders, and queries.

## Ownership

- Domain: `physics`
- Subdomain: `world`
- Kind: `domain-service`
- Proof group: `world-physics`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:runtime:events`

## Core Kit Reuse

- `core-physics-kit`
- `core-spatial-kit`
- `core-diagnostics-kit`

## Boundary

This kit owns only its domain/subdomain contract and composes upstream kits through snapshots.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:physics:world",
  "upstreamSnapshots": [
    "n:runtime:events"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:physics:world",
  "health": "registered",
  "proofGroup": "world-physics"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "physics",
  "subdomain": "world",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

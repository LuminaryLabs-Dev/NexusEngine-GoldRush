# n:world:heightfield

Status: v0.0.2 architecture scaffold

## Purpose

Heightfield kit for authored world data and terrain queries.

## Ownership

- Domain: `world`
- Subdomain: `heightfield`
- Kind: `domain-service`
- Proof group: `world-physics`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:world:terrain-source`

## Core Kit Reuse

- `core-spatial-kit`
- `core-scene-kit`
- `core-data-kit`

## Boundary

This kit owns only its domain/subdomain contract and composes upstream kits through snapshots.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:world:heightfield",
  "upstreamSnapshots": [
    "n:world:terrain-source"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:world:heightfield",
  "health": "registered",
  "proofGroup": "world-physics"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "world",
  "subdomain": "heightfield",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

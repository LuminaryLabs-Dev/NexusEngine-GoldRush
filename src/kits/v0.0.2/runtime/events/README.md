# n:runtime:events

Status: v0.0.2 architecture scaffold

## Purpose

Events kit for runtime composition and evidence flow.

## Ownership

- Domain: `runtime`
- Subdomain: `events`
- Kind: `runtime`
- Proof group: `runtime`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:runtime:registry`

## Core Kit Reuse

- `core-data-kit`
- `core-diagnostics-kit`
- `core-composition-kit`

## Boundary

This kit owns only its domain/subdomain contract and composes upstream kits through snapshots.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:runtime:events",
  "upstreamSnapshots": [
    "n:runtime:registry"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:runtime:events",
  "health": "registered",
  "proofGroup": "runtime"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "runtime",
  "subdomain": "events",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

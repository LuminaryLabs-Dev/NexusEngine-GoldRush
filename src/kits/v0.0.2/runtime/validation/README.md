# n:runtime:validation

Status: v0.0.2 architecture scaffold

## Purpose

Validation kit for runtime composition and evidence flow.

## Ownership

- Domain: `runtime`
- Subdomain: `validation`
- Kind: `runtime`
- Proof group: `runtime`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:runtime:registry`
- `n:runtime:snapshots`

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
  "domainPath": "n:runtime:validation",
  "upstreamSnapshots": [
    "n:runtime:registry",
    "n:runtime:snapshots"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:runtime:validation",
  "health": "registered",
  "proofGroup": "runtime"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "runtime",
  "subdomain": "validation",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

# n:match:receipts

Status: v0.0.2 architecture scaffold

## Purpose

Receipts kit for match lifecycle, receipts, scoring, replay, and results.

## Ownership

- Domain: `match`
- Subdomain: `receipts`
- Kind: `scoped-domain`
- Proof group: `gameplay-match`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:match:lifecycle`

## Core Kit Reuse

- `core-simulation-kit`
- `core-data-kit`
- `core-diagnostics-kit`

## Boundary

This kit owns only its domain/subdomain contract and composes upstream kits through snapshots.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:match:receipts",
  "upstreamSnapshots": [
    "n:match:lifecycle"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:match:receipts",
  "health": "registered",
  "proofGroup": "gameplay-match"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "match",
  "subdomain": "receipts",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

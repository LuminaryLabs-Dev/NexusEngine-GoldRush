# n:match:scoring

Status: v0.0.2 architecture scaffold

## Purpose

Scoring kit for match lifecycle, receipts, scoring, replay, and results.

## Ownership

- Domain: `match`
- Subdomain: `scoring`
- Kind: `scoped-domain`
- Proof group: `gameplay-match`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:match:receipts`

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
  "domainPath": "n:match:scoring",
  "upstreamSnapshots": [
    "n:match:receipts"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:match:scoring",
  "health": "registered",
  "proofGroup": "gameplay-match"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "match",
  "subdomain": "scoring",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

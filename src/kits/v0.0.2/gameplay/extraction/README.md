# n:gameplay:extraction

Status: v0.0.2 architecture scaffold

## Purpose

Extraction kit for player-facing gameplay rules and actions.

## Ownership

- Domain: `gameplay`
- Subdomain: `extraction`
- Kind: `scoped-domain`
- Proof group: `gameplay-match`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:gameplay:cargo`
- `n:world:routes`

## Core Kit Reuse

- `core-interaction-kit`
- `core-simulation-kit`
- `core-data-kit`

## Boundary

This kit owns only its domain/subdomain contract and composes upstream kits through snapshots.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:gameplay:extraction",
  "upstreamSnapshots": [
    "n:gameplay:cargo",
    "n:world:routes"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:gameplay:extraction",
  "health": "registered",
  "proofGroup": "gameplay-match"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "gameplay",
  "subdomain": "extraction",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

# n:gameplay:mining

Status: v0.0.2 architecture scaffold

## Purpose

Mining kit for player-facing gameplay rules and actions.

## Ownership

- Domain: `gameplay`
- Subdomain: `mining`
- Kind: `scoped-domain`
- Proof group: `gameplay-match`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:gameplay:interaction-hold`
- `n:world:placement`

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
  "domainPath": "n:gameplay:mining",
  "upstreamSnapshots": [
    "n:gameplay:interaction-hold",
    "n:world:placement"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:gameplay:mining",
  "health": "registered",
  "proofGroup": "gameplay-match"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "gameplay",
  "subdomain": "mining",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

# n:gameplay:combat-pressure

Status: v0.0.2 architecture scaffold

## Purpose

Combat Pressure kit for player-facing gameplay rules and actions.

## Ownership

- Domain: `gameplay`
- Subdomain: `combat-pressure`
- Kind: `scoped-domain`
- Proof group: `gameplay-match`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:gameplay:cargo`

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
  "domainPath": "n:gameplay:combat-pressure",
  "upstreamSnapshots": [
    "n:gameplay:cargo"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:gameplay:combat-pressure",
  "health": "registered",
  "proofGroup": "gameplay-match"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "gameplay",
  "subdomain": "combat-pressure",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

# n:gameplay:scoring-actions

Status: v0.0.2 architecture scaffold

## Purpose

Scoring Actions kit for player-facing gameplay rules and actions.

## Ownership

- Domain: `gameplay`
- Subdomain: `scoring-actions`
- Kind: `scoped-domain`
- Proof group: `gameplay-match`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:gameplay:extraction`

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
  "domainPath": "n:gameplay:scoring-actions",
  "upstreamSnapshots": [
    "n:gameplay:extraction"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:gameplay:scoring-actions",
  "health": "registered",
  "proofGroup": "gameplay-match"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "gameplay",
  "subdomain": "scoring-actions",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

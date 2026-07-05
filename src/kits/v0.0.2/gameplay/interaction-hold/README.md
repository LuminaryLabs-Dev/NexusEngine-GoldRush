# n:gameplay:interaction-hold

Status: v0.0.2 architecture scaffold

## Purpose

Interaction Hold kit for player-facing gameplay rules and actions.

## Ownership

- Domain: `gameplay`
- Subdomain: `interaction-hold`
- Kind: `scoped-domain`
- Proof group: `gameplay-match`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:control:interaction-input`

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
  "domainPath": "n:gameplay:interaction-hold",
  "upstreamSnapshots": [
    "n:control:interaction-input"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:gameplay:interaction-hold",
  "health": "registered",
  "proofGroup": "gameplay-match"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "gameplay",
  "subdomain": "interaction-hold",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

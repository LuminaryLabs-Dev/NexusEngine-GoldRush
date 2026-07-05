# n:network:handoff

Status: v0.0.2 architecture scaffold

## Purpose

Handoff kit for party, partition, staging, and handoff contracts.

## Ownership

- Domain: `network`
- Subdomain: `handoff`
- Kind: `scoped-domain`
- Proof group: `network`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:network:party-room`
- `n:scene:transition`

## Core Kit Reuse

- `core-network-kit`
- `core-data-kit`
- `core-diagnostics-kit`

## Boundary

This kit owns only its domain/subdomain contract and composes upstream kits through snapshots.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:network:handoff",
  "upstreamSnapshots": [
    "n:network:party-room",
    "n:scene:transition"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:network:handoff",
  "health": "registered",
  "proofGroup": "network"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "network",
  "subdomain": "handoff",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

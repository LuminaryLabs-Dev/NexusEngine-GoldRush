# n:network:local-simulation

Status: v0.0.2 architecture scaffold

## Purpose

Local Simulation kit for party, partition, staging, and handoff contracts.

## Ownership

- Domain: `network`
- Subdomain: `local-simulation`
- Kind: `scoped-domain`
- Proof group: `network`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:network:room-partitions`

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
  "domainPath": "n:network:local-simulation",
  "upstreamSnapshots": [
    "n:network:room-partitions"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:network:local-simulation",
  "health": "registered",
  "proofGroup": "network"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "network",
  "subdomain": "local-simulation",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

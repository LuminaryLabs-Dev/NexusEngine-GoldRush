# n:goldrush:train-boarding

Status: v0.0.2 architecture scaffold

## Purpose

Train Boarding kit for GoldRush-specific orchestration, content, and rules. It composes generic kits into GoldRush-specific orchestration.

## Ownership

- Domain: `goldrush`
- Subdomain: `train-boarding`
- Kind: `composite-domain`
- Proof group: `goldrush-integrated`
- Promotion status: `game-specific-v002`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:scene:train-loading`
- `n:behavior:train-sequence`
- `n:network:handoff`

## Core Kit Reuse

- `core-composition-kit`
- `core-data-kit`
- `core-diagnostics-kit`

## Boundary

This GoldRush kit composes generic kits into game-specific orchestration and is not promotable as-is.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:goldrush:train-boarding",
  "upstreamSnapshots": [
    "n:scene:train-loading",
    "n:behavior:train-sequence",
    "n:network:handoff"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:goldrush:train-boarding",
  "health": "registered",
  "proofGroup": "goldrush-integrated"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "goldrush",
  "subdomain": "train-boarding",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

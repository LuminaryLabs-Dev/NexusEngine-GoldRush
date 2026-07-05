# n:behavior:train-sequence

Status: v0.0.2 architecture scaffold

## Purpose

Train Sequence kit for outside-perspective system controllers that decide intent. It decides high-level intent from an outside-controller perspective and emits descriptors for execution kits.

## Ownership

- Domain: `behavior`
- Subdomain: `train-sequence`
- Kind: `system-controller`
- Proof group: `control-behavior-animation`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:behavior:body-state`
- `n:scene:train-loading`

## Core Kit Reuse

- `core-simulation-kit`
- `core-data-kit`
- `core-diagnostics-kit`

## Boundary

This system-controller kit decides intent and coordinates execution kits from an outside perspective.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:behavior:train-sequence",
  "upstreamSnapshots": [
    "n:behavior:body-state",
    "n:scene:train-loading"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:behavior:train-sequence",
  "health": "registered",
  "proofGroup": "control-behavior-animation"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "behavior",
  "subdomain": "train-sequence",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

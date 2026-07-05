# n:control:interaction-input

Status: v0.0.2 architecture scaffold

## Purpose

Interaction Input kit for input, camera, grounding, and interaction input.

## Ownership

- Domain: `control`
- Subdomain: `interaction-input`
- Kind: `execution`
- Proof group: `control-behavior-animation`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:control:input-context`

## Core Kit Reuse

- `core-input-kit`
- `core-camera-kit`
- `core-motion-kit`
- `core-physics-kit`

## Boundary

This kit owns only its domain/subdomain contract and composes upstream kits through snapshots.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:control:interaction-input",
  "upstreamSnapshots": [
    "n:control:input-context"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:control:interaction-input",
  "health": "registered",
  "proofGroup": "control-behavior-animation"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "control",
  "subdomain": "interaction-input",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

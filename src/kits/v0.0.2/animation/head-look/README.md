# n:animation:head-look

Status: v0.0.2 architecture scaffold

## Purpose

Head Look kit for narrow execution kits for body and tool motion. It applies one narrow motion descriptor and never owns game rules.

## Ownership

- Domain: `animation`
- Subdomain: `head-look`
- Kind: `execution`
- Proof group: `control-behavior-animation`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:behavior:body-state`
- `n:animation:animation-state`

## Core Kit Reuse

- `core-animation-kit`
- `core-motion-kit`
- `core-data-kit`

## Boundary

This execution kit applies one narrow motion descriptor and must not decide gameplay state.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:animation:head-look",
  "upstreamSnapshots": [
    "n:behavior:body-state",
    "n:animation:animation-state"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:animation:head-look",
  "health": "registered",
  "proofGroup": "control-behavior-animation"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "animation",
  "subdomain": "head-look",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

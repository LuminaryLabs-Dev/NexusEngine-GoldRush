# n:goldrush:train-route

Status: v0.0.2 architecture scaffold

## Purpose

Train Route kit for GoldRush-specific train source ingestion, staging, and composition.

## Ownership

- Domain: `goldrush`
- Subdomain: `train-route`
- Kind: `composite-domain`
- Proof group: `goldrush-integrated`
- Promotion status: `game-specific-v002`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:world:routes`
- `n:physics:terrain-collider`

## Core Kit Reuse

- `core-composition-kit`
- `core-data-kit`
- `core-diagnostics-kit`

## Boundary

This kit composes source and route metadata into the GoldRush train composition plan. It does not directly load raw FBX files at runtime.

## Example Input

```json
{
  "command": "sample-train-route",
  "routeId": "goldrush-train-route-v1",
  "phase": "departure",
  "progress": 0.5
}
```

## Example Output

```json
{
  "domainPath": "n:goldrush:train-route",
  "routeId": "goldrush-train-route-v1",
  "phase": "departure"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "goldrush",
  "subdomain": "train-route",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Confirm the train route kit appears in the registry, exposes the tangent-following Bezier route, and keeps route ownership separate from boarding and departure logic.

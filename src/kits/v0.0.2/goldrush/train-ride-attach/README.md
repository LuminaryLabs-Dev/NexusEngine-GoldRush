# n:goldrush:train-ride-attach

Status: v0.0.2 architecture scaffold

## Purpose

Train Ride Attach kit for GoldRush-specific train source ingestion, staging, and composition.

## Ownership

- Domain: `goldrush`
- Subdomain: `train-ride-attach`
- Kind: `composite-domain`
- Proof group: `goldrush-integrated`
- Promotion status: `game-specific-v002`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:goldrush:train-route`
- `n:control:third-person-camera`

## Core Kit Reuse

- `core-composition-kit`
- `core-data-kit`
- `core-diagnostics-kit`

## Boundary

This kit owns the ride attachment contract. The renderer may use the returned pose, but the attach decision belongs here.

## Example Input

```json
{
  "command": "resolve-train-ride-attachment",
  "playerLockedToTrain": true,
  "routePhase": "departure"
}
```

## Example Output

```json
{
  "domainPath": "n:goldrush:train-ride-attach",
  "attached": true,
  "cameraDirective": "follow-train"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "goldrush",
  "subdomain": "train-ride-attach",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Confirm the ride attach kit reports follow-train camera behavior only when the boarded player is actually locked to the train.

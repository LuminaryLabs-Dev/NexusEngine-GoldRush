# n:goldrush:train-departure-handoff

Status: v0.0.2 architecture scaffold

## Purpose

Train Departure Handoff kit for GoldRush-specific train source ingestion, staging, and composition.

## Ownership

- Domain: `goldrush`
- Subdomain: `train-departure-handoff`
- Kind: `composite-domain`
- Proof group: `goldrush-integrated`
- Promotion status: `game-specific-v002`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:goldrush:train-ride-attach`
- `n:network:handoff`

## Core Kit Reuse

- `core-composition-kit`
- `core-data-kit`
- `core-diagnostics-kit`

## Boundary

This kit owns the readiness gate for departure and handoff. It does not own renderer truth or matchmaking policy.

## Example Input

```json
{
  "command": "resolve-train-departure-handoff",
  "departureProgress": 1,
  "playerLockedToTrain": true
}
```

## Example Output

```json
{
  "domainPath": "n:goldrush:train-departure-handoff",
  "ready": true,
  "cameraDirective": "follow-train"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "goldrush",
  "subdomain": "train-departure-handoff",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Confirm the departure/handoff kit only releases the train once local boarding, party readiness, and peer readiness are all true.

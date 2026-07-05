# n:goldrush:train-boarding-cue

Status: v0.0.2 architecture scaffold

## Purpose

Train Boarding Cue kit for GoldRush-specific train source ingestion, staging, and composition.

## Ownership

- Domain: `goldrush`
- Subdomain: `train-boarding-cue`
- Kind: `composite-domain`
- Proof group: `goldrush-integrated`
- Promotion status: `game-specific-v002`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:goldrush:train-route`
- `n:scene:train-loading`

## Core Kit Reuse

- `core-composition-kit`
- `core-data-kit`
- `core-diagnostics-kit`

## Boundary

This kit owns only boarding-cue contract state. The renderer may draw the cue, but the cue contract is resolved here.

## Example Input

```json
{
  "command": "resolve-train-boarding-cue",
  "doorProgress": 0.92,
  "playerLockedToTrain": false
}
```

## Example Output

```json
{
  "domainPath": "n:goldrush:train-boarding-cue",
  "status": "board-now",
  "visible": true
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "goldrush",
  "subdomain": "train-boarding-cue",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Confirm the train boarding cue contract appears in the registry, exposes a stable anchor, and still resolves board-now visibility from boarding state instead of renderer-only guesswork.

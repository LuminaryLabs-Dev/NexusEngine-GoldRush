# n:audio:music-state

Status: v0.0.2 architecture scaffold

## Purpose

Music State kit for music, cue, one-shot, and fallback audio state.

## Ownership

- Domain: `audio`
- Subdomain: `music-state`
- Kind: `domain-service`
- Proof group: `audio`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:runtime:events`

## Core Kit Reuse

- `core-audio-kit`
- `core-data-kit`
- `core-diagnostics-kit`

## Boundary

This kit owns only its domain/subdomain contract and composes upstream kits through snapshots.

## Example Input

```json
{
  "command": "install-kit",
  "domainPath": "n:audio:music-state",
  "upstreamSnapshots": [
    "n:runtime:events"
  ]
}
```

## Example Output

```json
{
  "domainPath": "n:audio:music-state",
  "health": "registered",
  "proofGroup": "audio"
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "audio",
  "subdomain": "music-state",
  "installed": false,
  "resetCount": 1
}
```

## First Proof

Run the v0.0.2 validators and confirm this kit appears in the registry, has a folder contract, belongs to a grouped proof page, and passes boundary checks.

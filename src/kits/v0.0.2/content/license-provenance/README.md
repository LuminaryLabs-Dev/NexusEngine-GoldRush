# n:content:license-provenance

Status: v0.0.2 architecture scaffold

## Purpose

License Provenance kit for GoldRush FBX asset ingestion, staging, and provenance tracking.

## Ownership

- Domain: `content`
- Subdomain: `license-provenance`
- Kind: `host-support`
- Proof group: `content`
- Promotion status: `local-v002-incubation`

## Public API

`install`, `reset`, `snapshot`, `validate`

## Dependencies

- `n:content:source-asset-intake`

## Core Kit Reuse

- `core-data-kit`
- `core-diagnostics-kit`
- `core-composition-kit`

## Boundary

This kit records license identity, attribution, and provenance decisions. It does not approve runtime promotion by itself.

## Example Input

```json
{
  "command": "record-license-provenance",
  "sourcePackId": "quaternius-modular-train-pack",
  "licenseId": "CC0-1.0",
  "licenseLabel": "CC0 1.0 Universal",
  "attribution": "Quaternius Modular Train Pack"
}
```

## Example Output

```json
{
  "domainPath": "n:content:license-provenance",
  "health": "registered",
  "licenseId": "CC0-1.0",
  "runtimePromotion": false
}
```

## Reset/Snapshot Example

```json
{
  "version": "v0.0.2",
  "domain": "content",
  "subdomain": "license-provenance",
  "installed": false,
  "resetCount": 1,
  "licenseId": null
}
```

## First Proof

Confirm the content validator passes, the CC0 license is recorded, and no approval record is mistaken for runtime promotion.

# Source Fixture Authoring Packet

Status: active docs-only
Date: 2026-07-01
Parent: drawn terrain source
Domain: world / validation / render / physics / gameplay

## Purpose

Define the first authored terrain source fixture that future runtime work should build before changing the live GoldRush terrain. This fixture is the smallest useful desert map asset that can prove the source pipeline, not the final map.

## Why This Exists

The drawn terrain source packet says the map must become the primary asset. This packet makes that actionable by defining one tiny source fixture that can feed height, masks, LOD chunks, raycasts, placement anchors, gameplay zones, and proof receipts.

## Fixture Shape

```txt
goldrush.desert.fixture.001
|-- metadata
|-- bounds and scale
|-- height grid
|-- derived normals and slope
|-- masks
|-- chunks and lod bands
|-- route graph
|-- placement anchors
|-- gameplay zones
|-- proof samples
`-- expected validation receipts
```

## Files

- `source-fixture-authoring-matrix.md`
- `001-authoring-purpose.md`
- `002-mini-map-fixture-schema.md`
- `003-fixture-layer-matrix.md`
- `004-reference-technical-notes.md`
- `005-fixture-validator-plan.md`
- `006-consumer-proof-matrix.md`
- `007-authoring-restart-policy.md`
- `008-first-map-slice-simulation.md`

## Rule

The first implementation slice should prove this fixture with validators before it changes the main renderer, collider, or gameplay loop.


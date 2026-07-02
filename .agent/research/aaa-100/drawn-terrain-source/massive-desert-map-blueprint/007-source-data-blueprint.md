# Source Data Blueprint

Status: active docs-only
Domain: data / world / validation

## Purpose

Define the minimal serializable source data shape for the massive desert map blueprint.

## Data Shape

```txt
desertMapSource
|-- schemaVersion
|-- sourceId
|-- revisionId
|-- worldBounds
|-- units
|-- layers
|-- cells
|-- routes
|-- zones
|-- anchors
|-- budgets
|-- consumers
`-- proofFixtures
```

## Required Budgets

| Budget | Why |
| --- | --- |
| max near cell triangles | keeps player scene renderable |
| max mid cell triangles | keeps route readability affordable |
| max far cell proxies | keeps horizon stable |
| max collider samples | keeps physics bounded |
| max anchor count per cell | avoids object floods |
| max interactables per route leg | avoids unreadable prompts |
| max proof route duration | keeps CI proof useful |

## Public Snapshot

The runtime-facing snapshot should expose:

- source id
- revision id
- world bounds
- active cell ids
- active LOD levels
- route node count
- zone count
- anchor family counts
- consumer revision ids
- proof status

It should not expose authoring paths or source-only files.

## Validation Names

- `validate-desert-map-source.mjs`
- `validate-desert-map-cells.mjs`
- `validate-desert-map-anchors.mjs`
- `validate-desert-map-routes.mjs`
- `validate-desert-map-consumer-lockstep.mjs`


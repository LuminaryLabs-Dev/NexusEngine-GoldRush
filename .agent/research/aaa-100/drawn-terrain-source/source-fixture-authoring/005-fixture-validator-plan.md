# Fixture Validator Plan

Status: active docs-only
Domain: validation
Future kit: `n:runtime:validation`

## Validator Name

Future command: `node tools/validation/validate-authored-terrain-source-fixture.mjs`

## Validator Scope

| Check | Failure caught |
| --- | --- |
| Required keys exist | partial fixture silently accepted |
| Revision hash exists | stale render/collider/proof comparisons |
| Bounds are coherent | map scale inversion or zero-size world |
| Sample spacing is positive | invalid heightfield geometry |
| Height grid matches dimensions | broken height sampling |
| Normals/slope can derive | lighting/movement mismatch |
| Required masks exist | gameplay/placement inference from visuals |
| Masks match grid dimensions | invalid source queries |
| Chunk edges have neighbors | seam and crack regressions |
| Anchors sample valid ground | floating props and debug placement |
| Route samples connect | route guidance proof cannot run |
| Gold/extraction zones are reachable | game loop relies on helper placement |
| Collider samples match height | player floats or sinks |
| Snapshot is serializable | runtime/proof cannot compare state |

## Required Fixtures

The first fixture must include both valid and invalid samples:

- valid walkable sample
- invalid blocker sample
- valid mine anchor
- invalid mine anchor
- valid extraction anchor
- invalid extraction anchor
- valid route segment
- broken route segment
- valid chunk seam
- invalid seam example

## Stop Condition

Do not proceed to renderer terrain replacement if the fixture validator cannot fail intentionally bad data.


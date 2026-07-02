# Normal And Slope Contract Micro Matrix

Status: implemented-local
Parent atom: `004-normal-and-slope-contract`

## Purpose

Track the 12 micro-steps required before future code can safely claim the terrain fixture has usable normals and slopes.

| ID | Micro atom | Source field | Required proof | State |
| --- | --- | --- | --- | --- |
| 001 | [Normal Vector Shape](micro/001-normal-vector-shape.md) | normal | sampleGround returns a three-component finite unit normal for every named walkable proof point | implemented-local |
| 002 | [Normal Space Contract](micro/002-normal-space-contract.md) | normalSpace | snapshot states whether normals are source-local, fixture-local, or world-space and how consumers convert them | implemented-local |
| 003 | [Slope Value Domain](micro/003-slope-value-domain.md) | slopeDegrees | validator rejects non-finite, negative, and impossible slope values outside the declared domain | implemented-local |
| 004 | [Slope Class Taxonomy](micro/004-slope-class-taxonomy.md) | slopeClass | sampleGround returns flat, walkable, steep, blocker, or edge class from source thresholds | implemented-local |
| 005 | [Walkable Slope Thresholds](micro/005-walkable-slope-thresholds.md) | walkableSlopeThresholds | movement proof can name slope thresholds for walk, slow, slide, and blocked results | implemented-local |
| 006 | [Normal Derivation Source](micro/006-normal-derivation-source.md) | normalDerivation | normal calculation declares whether it comes from authored normal layer, height gradients, or validated hybrid source | implemented-local |
| 007 | [Gradient Sample Neighborhood](micro/007-gradient-sample-neighborhood.md) | gradientKernel | height-gradient normals declare sample neighborhood and edge behavior | implemented-local |
| 008 | [Sample Ground Api Shape](micro/008-sample-ground-api-shape.md) | sampleGroundApi | public API returns height, normal, slope, class, fixture id, revision id, and source cell id together | implemented-local |
| 009 | [Movement Consumer Parity](micro/009-movement-consumer-parity.md) | movementGroundEcho | movement snapshot echoes source normal and slope used for grounded, slow, slide, or blocked state | implemented-local |
| 010 | [Placement Consumer Parity](micro/010-placement-consumer-parity.md) | placementNormalEcho | prop placement snapshot echoes source normal and slope used for alignment or rejection | implemented-local |
| 011 | [Slope Negative Fixture Cases](micro/011-slope-negative-fixture-cases.md) | slopeNegativeCases | validator fails missing normals, non-unit normals, impossible slopes, and class-threshold contradictions | implemented-local |
| 012 | [Normal Slope Stale Proof](micro/012-normal-slope-stale-proof.md) | normalSlopeRevisionPolicy | normal or slope changes mark movement, placement, collider, screenshot, and public proof stale | implemented-local |

## Use Rule

Future implementation should start at 001 and stop whenever a validator can pass without proving source-owned normal, slope, movement, and placement echo.

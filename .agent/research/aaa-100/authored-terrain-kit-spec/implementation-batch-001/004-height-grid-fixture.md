# Height Grid Fixture

Status: active docs-only

Packet: 004
Domain: world
Target kit: n:world:terrain-heightfield
Roadmap atoms: 022, 023, 026

## Purpose

Define the drawn height source that drives visible mesh vertices, terrain raycasts, and collider generation.

## Why This Prevents Plateau

The player floats or clips when the visual terrain and gameplay height are separate approximations instead of one authored grid.

## Data Exposed

- gridWidth
- gridDepth
- cellSize
- heightMin
- heightMax
- heightSamples
- origin
- borderPolicy

## Public API Shape

- sampleHeight(x, z)
- sampleNormal(x, z)
- sampleSlope(x, z)
- getHeightGridDescriptor()

## Events And Snapshot

- heightGridLoaded
- heightSampleOutOfBounds
- heightGridRejected

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- CLI samples canonical points across corners, center, ridge, valley, and border
- collider parity proof uses the same height grid
- browser proof labels terrain revision in debug snapshot

## Edge Cases And Stop Conditions

- Reject inverted or NaN height samples.
- Define borders so raycasts never fall through at seams.
- Stop if the renderer requires a smoothed grid that physics cannot share.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

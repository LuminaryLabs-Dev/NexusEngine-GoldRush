# Coordinate Scale Data Research

Status: active docs-only
Atom: 03-02

## Research Question

What source-artboard evidence or external reference signal makes coordinate-scale / data production-worthy for GoldRush?

## Current Reference Signals

- Game-engine feature references point toward explicit terrain source data, streaming cells, physics, tools, validation, profiling, and asset pipelines.
- Landscape and terrain docs point toward height fields, dimensions, component/cell thinking, and material layers.
- Heightfield references point toward named mask layers that can drive shaping, shading, scattering, and proof.
- Battle-royale references point toward 60-player scale, massive maps, squads, route pressure, and closing pressure.

## GoldRush Translation

The map needs explicit bounds, units, cells, travel times, spawn density, and partition hints.

The implementation implication is local: create source fields, derived descriptors, and proof gates inside GoldRush. Do not turn this into a general engine feature.

## Evidence Needed Later

- Source artboard field name.
- Owning generic and GoldRush kit.
- Consumer snapshot field.
- Validator or simulator report name.
- Required human-view shot if visual.
- Public proof condition if deploy-facing.

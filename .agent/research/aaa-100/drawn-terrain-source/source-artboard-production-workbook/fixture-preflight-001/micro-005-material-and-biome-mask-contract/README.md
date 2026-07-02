# Micro 005 - Material And Biome Mask Contract

Status: implemented-local
Parent atom: `005-material-and-biome-mask-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Break the material and biome mask atom into micro-steps small enough for the authored terrain validator implementation. This packet is implemented locally and validated.

## Rule

The terrain source must own material and biome identity before render, audio, VFX, placement, gameplay zones, or proof consumers can claim the map is authored rather than just colored.

## Why This Matters

GoldRush needs the ground to mean something. Sand, rock, gravel, clay, mine tailings, rail beds, town shelves, gold seams, and extraction sites should drive visuals, sounds, effects, object placement, route readability, and gameplay pressure from one source revision.

## Files

- `micro-matrix.md`
- `research-matrix.md`
- `simulation-matrix.md`
- `audit-matrix.md`
- `micro/`
- `research/`
- `simulations/`
- `audits/`

## Exit Gate

This micro-runway is implemented locally when each micro-step names its source field, validator case, consumer echo, negative fixture case, player-facing implication, and stale-proof implication.

# Micro 004 - Normal And Slope Contract

Status: implemented-local
Parent atom: `004-normal-and-slope-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Break the normal and slope atom into micro-steps small enough for the first future terrain-raycast and player-grounding validator implementation. This packet now has a local implementation slice in the authored terrain fixture and validator.

## Rule

The first terrain implementation must prove normal and slope data from the authored fixture before movement, placement, collider, render, or gameplay consumers can treat terrain footing as valid.

## Why This Matters

GoldRush needs slopes to mean gameplay: walking, slowing, sliding, blocking, prop placement, mining positions, cover reliability, and readable mountain paths. Normals cannot be only a Three.js lighting artifact; they must be source-owned facts that consumers echo.

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

This micro-runway is complete enough for local validation when each micro-step names its source field, validator case, consumer echo, negative fixture case, movement implication, and stale-proof implication.

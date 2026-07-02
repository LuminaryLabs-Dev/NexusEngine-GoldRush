# Micro 011 - Rail And Train Reference Contract

Status: active docs-only
Parent atom: `011-rail-and-train-reference-contract`
Fixture id: `goldrush.desert.artboard.fixture.001`

## Purpose

Break the rail and train reference atom into micro-steps small enough for the first future source-authored train intro, rail route, boarding, camera handoff, audio cue, and match-map linkage implementation. This packet is still docs-only.

## Rule

The terrain source must own rail splines, train stops, loading-yard links, train path queries, boarding sides, train motion states, rail/terrain parity, rail prop anchors, train camera handoff, train audio cues, negative cases, and stale-proof behavior before train movement, boarding, scene transition, camera, audio, screenshots, simulator proof, or public proof can claim authored train correctness.

## Why This Matters

GoldRush cannot feel like one coherent wild-west extraction game if the train intro is a separate cinematic bolted onto the match map. The train should ride a source-owned rail route, stop at source-owned anchors, board from source-owned sides, and hand the player into the gold field through the same direction labels the map uses.

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

This micro-runway is ready for future implementation when each micro-step names its source field, validator case, consumer echo, negative fixture case, player-facing train implication, camera/audio implication, and stale-proof implication.

# Train Loading Sequence - Event Flow Research

Status: planned docs-only
Related packet: ../slices/06-03-train-loading-sequence-event-flow.md

## Reference Signal

Use Apex as a mode-architecture reference: competitive mode, relaxed mode, bot mode, private match, and 60-player private surfaces.

Reference: https://help.ea.com/en/articles/apex-legends/game-modes/

## Product Implication

GoldRush should preserve a clear player-facing loop while its internals stay domain based. This slice must improve one of the visible outcomes: identity, readable staging, movement, terrain trust, mining, cargo stakes, combat pressure, extraction, scoring, single-player staging, 60-player readiness, or public proof.

## Architecture Implication

The owning GoldRush kit is `n:goldrush:train-loading`. The reusable dependency is `n:scene:transition`. The future implementation should keep public API small, push detailed work into private helpers, and expose facts through events and snapshots.

## Data Implication

This slice should expose a stable `trainLoadingSequence` snapshot and emit `train.sequence.beat.changed`. Adjacent slices should subscribe to the event instead of reaching into private state.

## Validation Implication

Use `validate-first-sequence` as the initial proof route, then add a browser or simulator proof when the slice touches player-facing flow. Negative fixtures must cover this fakeout: The scene changes to the field without the player performing a readable train interaction.

## Battle Royale Or Extraction Implication

The slice should support at least one of these final-state needs:

- 60-player match architecture with bounded state.
- single-player staging that can simulate the full loop.
- readable squad start and leader launch.
- large authored terrain with reliable traversal.
- gold value that creates risk and extraction decisions.
- combat pressure that is visible before it is punishing.
- public proof that matches local proof.

## Restart Question

If this slice is too broad or brittle during implementation, what smaller local GoldRush kit should replace it, and what event should bridge the old and new packets?


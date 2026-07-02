# Group Selection Match Config - Contract Research

Status: planned docs-only
Related packet: ../slices/05-01-group-selection-match-config-contract.md

## Reference Signal

Use Fortnite mode support as a reminder that squad size options are product configuration, not only networking implementation.

Reference: https://www.epicgames.com/help/c-202300000001636/c-202300000001721/can-i-play-trios-in-fortnite-zero-build-ranked-a202300000013544

## Product Implication

GoldRush should preserve a clear player-facing loop while its internals stay domain based. This slice must improve one of the visible outcomes: identity, readable staging, movement, terrain trust, mining, cargo stakes, combat pressure, extraction, scoring, single-player staging, 60-player readiness, or public proof.

## Architecture Implication

The owning GoldRush kit is `n:goldrush:party-lobby`. The reusable dependency is `n:match:lifecycle`. The future implementation should keep public API small, push detailed work into private helpers, and expose facts through events and snapshots.

## Data Implication

This slice should expose a stable `groupSelectionMatchConfig` snapshot and emit `match.config.changed`. Adjacent slices should subscribe to the event instead of reaching into private state.

## Validation Implication

Use `validate-match-lifecycle` as the initial proof route, then add a browser or simulator proof when the slice touches player-facing flow. Negative fixtures must cover this fakeout: The UI lets players choose a label but the runtime match config ignores it.

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


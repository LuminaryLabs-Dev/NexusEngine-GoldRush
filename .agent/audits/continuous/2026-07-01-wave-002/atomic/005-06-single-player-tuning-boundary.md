# Single Player Tuning Boundary

Status: active docs-only

Atom ID: 005-06
Parent packet: 005 - Extraction Stakes And Loss Gap
Domain: gameplay/match/progression
Owner: n:gameplay:extraction plus n:match:receipts plus n:match:results

## Atomic Objective

Keep staging losses useful for testing without making real stakes meaningless.

## Source Context

Hunt foregrounds bounty value, extraction fights, and meaningful loss; GoldRush needs gold to create leave-or-greed decisions.

## Data Contract Seed

mode id, penalty scalar, staging flag, persistence flag

## Event And Snapshot Seed

Event: stagingPenaltyApplied

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

validator blocks staging settings in normal mode

## Research Pair

- research/005-06-single-player-tuning-boundary-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

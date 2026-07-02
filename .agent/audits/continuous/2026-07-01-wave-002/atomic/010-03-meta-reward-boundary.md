# Meta Reward Boundary

Status: active docs-only

Atom ID: 010-03
Parent packet: 010 - Progression Replay And Retention Gap
Domain: match/progression/product
Owner: n:match:results plus n:match:replay-summary plus n:goldrush:progression

## Atomic Objective

Separate cosmetic, tool, title, and progression rewards from run-local receipts.

## Source Context

Modern battle royale and extraction games turn each match into a summary, lesson, reward, and reason to play again.

## Data Contract Seed

reward id, reward class, persistence rule, unlock condition

## Event And Snapshot Seed

Event: metaRewardClassified

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

validator blocks persistence without save gate

## Research Pair

- research/010-03-meta-reward-boundary-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

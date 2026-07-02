# Run Summary Causality

Status: active docs-only

Atom ID: 010-02
Parent packet: 010 - Progression Replay And Retention Gap
Domain: match/progression/product
Owner: n:match:results plus n:match:replay-summary plus n:goldrush:progression

## Atomic Objective

Explain why the run succeeded or failed using receipts, not generic score text.

## Source Context

Modern battle royale and extraction games turn each match into a summary, lesson, reward, and reason to play again.

## Data Contract Seed

cause id, receipt ids, outcome, player lesson, next action

## Event And Snapshot Seed

Event: runCausalitySummarized

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

human-view results review sees clear cause

## Research Pair

- research/010-02-run-summary-causality-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

# Loss Receipt Chain

Status: active docs-only

Atom ID: 005-03
Parent packet: 005 - Extraction Stakes And Loss Gap
Domain: gameplay/match/progression
Owner: n:gameplay:extraction plus n:match:receipts plus n:match:results

## Atomic Objective

Track mined, carried, dropped, stolen, lost, extracted, and banked gold separately.

## Source Context

Hunt foregrounds bounty value, extraction fights, and meaningful loss; GoldRush needs gold to create leave-or-greed decisions.

## Data Contract Seed

receipt type, gold amount, source, sink, result effect

## Event And Snapshot Seed

Event: goldReceiptRecorded

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

results proof explains what changed

## Research Pair

- research/005-03-loss-receipt-chain-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

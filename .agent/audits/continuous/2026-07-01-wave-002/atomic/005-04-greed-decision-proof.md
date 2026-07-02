# Greed Decision Proof

Status: active docs-only

Atom ID: 005-04
Parent packet: 005 - Extraction Stakes And Loss Gap
Domain: gameplay/match/progression
Owner: n:gameplay:extraction plus n:match:receipts plus n:match:results

## Atomic Objective

Create human-view proof for the decision to mine more or leave.

## Source Context

Hunt foregrounds bounty value, extraction fights, and meaningful loss; GoldRush needs gold to create leave-or-greed decisions.

## Data Contract Seed

current value, nearby risk, route distance, extraction cue, player action

## Event And Snapshot Seed

Event: greedDecisionPresented

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

proof shows reason without debug text

## Research Pair

- research/005-04-greed-decision-proof-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

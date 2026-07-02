# Carry Value Risk Contract

Status: active docs-only

Atom ID: 005-01
Parent packet: 005 - Extraction Stakes And Loss Gap
Domain: gameplay/match/progression
Owner: n:gameplay:extraction plus n:match:receipts plus n:match:results

## Atomic Objective

Define how carried gold changes visibility, movement, noise, and ambush risk.

## Source Context

Hunt foregrounds bounty value, extraction fights, and meaningful loss; GoldRush needs gold to create leave-or-greed decisions.

## Data Contract Seed

gold amount, value tier, speed scalar, noise radius, visibility cue

## Event And Snapshot Seed

Event: carryRiskUpdated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

validator proves cargo feeds movement and threat

## Research Pair

- research/005-01-carry-value-risk-contract-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

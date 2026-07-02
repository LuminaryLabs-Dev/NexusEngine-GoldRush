# Cashout Contest Contract

Status: active docs-only

Atom ID: 005-02
Parent packet: 005 - Extraction Stakes And Loss Gap
Domain: gameplay/match/progression
Owner: n:gameplay:extraction plus n:match:receipts plus n:match:results

## Atomic Objective

Make cashout zones contestable with clear cause, progress, interruption, and receipt output.

## Source Context

Hunt foregrounds bounty value, extraction fights, and meaningful loss; GoldRush needs gold to create leave-or-greed decisions.

## Data Contract Seed

zone id, contest state, progress, interrupt source, receipt id

## Event And Snapshot Seed

Event: cashoutContested

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

browser proof shows contested cashout state

## Research Pair

- research/005-02-cashout-contest-contract-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

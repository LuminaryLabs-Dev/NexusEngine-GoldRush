# Return To Lobby Flow

Status: active docs-only

Atom ID: 010-05
Parent packet: 010 - Progression Replay And Retention Gap
Domain: match/progression/product
Owner: n:match:results plus n:match:replay-summary plus n:goldrush:progression

## Atomic Objective

Make post-results actions return to lobby or run another claim cleanly.

## Source Context

Modern battle royale and extraction games turn each match into a summary, lesson, reward, and reason to play again.

## Data Contract Seed

action id, target scene, payload, reset scope

## Event And Snapshot Seed

Event: postResultsActionSelected

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

browser proof covers both actions

## Research Pair

- research/010-05-return-to-lobby-flow-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

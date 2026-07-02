# Replay Moment Taxonomy

Status: active docs-only

Atom ID: 010-01
Parent packet: 010 - Progression Replay And Retention Gap
Domain: match/progression/product
Owner: n:match:results plus n:match:replay-summary plus n:goldrush:progression

## Atomic Objective

Define replay moment types for mining, threat, route, cashout, loss, score, and rescue.

## Source Context

Modern battle royale and extraction games turn each match into a summary, lesson, reward, and reason to play again.

## Data Contract Seed

moment type, source receipt, player-facing label, priority

## Event And Snapshot Seed

Event: replayMomentClassified

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

results proof shows key moments

## Research Pair

- research/010-01-replay-moment-taxonomy-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

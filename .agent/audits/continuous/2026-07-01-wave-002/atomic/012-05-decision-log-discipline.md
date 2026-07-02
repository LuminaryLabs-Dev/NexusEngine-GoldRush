# Decision Log Discipline

Status: active docs-only

Atom ID: 012-05
Parent packet: 012 - Live Ops Versioning And Restart Gap
Domain: release/governance/runtime
Owner: n:runtime:snapshot plus agent-it workspace plus Build deployment

## Atomic Objective

Keep durable decisions in memory/lessons without duplicating stale claims.

## Source Context

Long-running battle royale projects require versioned decisions, restart packets, deploy proofs, and public evidence tied to the exact build.

## Data Contract Seed

decision id, replaces, affected kits, proof link

## Event And Snapshot Seed

Event: decisionLogged

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

lessons matrix has no contradictory duplicate

## Research Pair

- research/012-05-decision-log-discipline-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

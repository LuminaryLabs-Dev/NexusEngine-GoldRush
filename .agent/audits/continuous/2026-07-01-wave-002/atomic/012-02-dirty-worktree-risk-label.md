# Dirty Worktree Risk Label

Status: active docs-only

Atom ID: 012-02
Parent packet: 012 - Live Ops Versioning And Restart Gap
Domain: release/governance/runtime
Owner: n:runtime:snapshot plus agent-it workspace plus Build deployment

## Atomic Objective

Label dirty scratch deletions and untracked docs so future work does not misread them as runtime changes.

## Source Context

Long-running battle royale projects require versioned decisions, restart packets, deploy proofs, and public evidence tied to the exact build.

## Data Contract Seed

risk id, file class, owner, action needed, caveat

## Event And Snapshot Seed

Event: worktreeRiskLabeled

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

status review separates scratch from authored docs

## Research Pair

- research/012-02-dirty-worktree-risk-label-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

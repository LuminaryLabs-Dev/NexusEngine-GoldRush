# Build Branch Proof Link

Status: active docs-only

Atom ID: 012-03
Parent packet: 012 - Live Ops Versioning And Restart Gap
Domain: release/governance/runtime
Owner: n:runtime:snapshot plus agent-it workspace plus Build deployment

## Atomic Objective

Tie Build branch public proof to commit and feature scope.

## Source Context

Long-running battle royale projects require versioned decisions, restart packets, deploy proofs, and public evidence tied to the exact build.

## Data Contract Seed

branch, commit, public url, proof scenario, coverage caveat

## Event And Snapshot Seed

Event: buildProofLinked

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

public proof report includes commit scope

## Research Pair

- research/012-03-build-branch-proof-link-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

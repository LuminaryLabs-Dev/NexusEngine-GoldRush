# Source Revision Ledger

Status: active docs-only

Atom ID: 012-01
Parent packet: 012 - Live Ops Versioning And Restart Gap
Domain: release/governance/runtime
Owner: n:runtime:snapshot plus agent-it workspace plus Build deployment

## Atomic Objective

Record terrain, asset, runtime, proof, and deploy revisions in restart-friendly form.

## Source Context

Long-running battle royale projects require versioned decisions, restart packets, deploy proofs, and public evidence tied to the exact build.

## Data Contract Seed

revision id, domain, source hash, consumer hash, proof id

## Event And Snapshot Seed

Event: sourceRevisionRecorded

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

restart packet names current revisions

## Research Pair

- research/012-01-source-revision-ledger-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

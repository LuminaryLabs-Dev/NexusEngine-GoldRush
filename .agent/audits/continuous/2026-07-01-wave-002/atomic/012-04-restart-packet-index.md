# Restart Packet Index

Status: active docs-only

Atom ID: 012-04
Parent packet: 012 - Live Ops Versioning And Restart Gap
Domain: release/governance/runtime
Owner: n:runtime:snapshot plus agent-it workspace plus Build deployment

## Atomic Objective

Create one compact index that points to the latest roadmap, simulations, audits, and proof reports.

## Source Context

Long-running battle royale projects require versioned decisions, restart packets, deploy proofs, and public evidence tied to the exact build.

## Data Contract Seed

index id, latest wave, latest batch, latest proof, next packet

## Event And Snapshot Seed

Event: restartIndexUpdated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

future turn can start from one file

## Research Pair

- research/012-04-restart-packet-index-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

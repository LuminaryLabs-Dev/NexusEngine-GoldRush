# Completion Audit Template

Status: active docs-only

Atom ID: 012-06
Parent packet: 012 - Live Ops Versioning And Restart Gap
Domain: release/governance/runtime
Owner: n:runtime:snapshot plus agent-it workspace plus Build deployment

## Atomic Objective

Define requirement-by-requirement evidence needed before the active goal can ever be marked complete.

## Source Context

Long-running battle royale projects require versioned decisions, restart packets, deploy proofs, and public evidence tied to the exact build.

## Data Contract Seed

requirement id, evidence type, source, status, gap

## Event And Snapshot Seed

Event: completionAuditTemplateCreated

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

goal remains active until every requirement is proven

## Research Pair

- research/012-06-completion-audit-template-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

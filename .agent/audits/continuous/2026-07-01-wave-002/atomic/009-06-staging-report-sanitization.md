# Staging Report Sanitization

Status: active docs-only

Atom ID: 009-06
Parent packet: 009 - Staging And Bot Proof Gap
Domain: staging/validation/network
Owner: n:goldrush:single-player-staging plus n:runtime:validation

## Atomic Objective

Make staging reports sanitized and explicit about simulated versus live behavior.

## Source Context

A 60-player target needs staging proof when live players are not available; bot behavior must exercise the game loop rather than stand still.

## Data Contract Seed

report id, simulated count, live count, local/public target, redactions

## Event And Snapshot Seed

Event: stagingReportWritten

Snapshot must include parent packet id, atom id, owner kit, source revision, readiness state, unresolved caveats, and sanitized proof labels.

## Validation Seed

report-secret validation passes

## Research Pair

- research/009-06-staging-report-sanitization-research.md

## Stop Condition

Stop implementation if this atom requires runtime behavior outside the named owner kit, bypasses validation, relies on unapproved assets, or lets a narrow local check imply broad AAA readiness.

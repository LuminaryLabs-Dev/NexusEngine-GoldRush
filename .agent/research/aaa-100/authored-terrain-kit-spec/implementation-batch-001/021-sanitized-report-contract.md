# Sanitized Report Contract

Status: active docs-only

Packet: 021
Domain: runtime
Target kit: n:runtime:validation
Roadmap atoms: all authored terrain packets

## Purpose

Define how authored-terrain reports stay shareable by default while still preserving enough evidence to debug issues.

## Why This Prevents Plateau

Iteration slows down when proof artifacts cannot be shared because they contain local paths, account names, raw asset paths, or secret-like values.

## Data Exposed

- safeArtifactLabel
- scenarioId
- sourceRevisionHash
- relativeProofPath
- redactionSummary
- validationStatus

## Public API Shape

- sanitizeProofReport(report)
- assertNoSensitivePaths(report)
- writeSafeArtifactIndex()

## Events And Snapshot

- reportSanitized
- reportRejectedForSensitiveData
- safeArtifactWritten

Snapshot must include the target kit, source revision, consumer revision, validation state, and enough domain state to debug without leaking machine-local paths.

## Validation And Proof

- report-secret validator passes over docs, .agent, reports, and public smoke outputs
- local paths are replaced with relative labels

## Edge Cases And Stop Conditions

- Do not store browser profile names or account emails.
- Do not expose source machine paths.
- Stop if a proof needs sensitive data to be useful.

## Implementation Note

Do not code from this packet alone. Read the parent authored terrain spec, the matching atomic map packet, the matching four research packets, the implementation simulation, and the hardening audit before editing runtime files.

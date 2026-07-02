# Release Readiness Staging Gate

Status: active docs-only

## Purpose

Prevent release claims when staging proof is incomplete or mislabeled.

## Minimum Before Release Claim

- practice mode proof.
- bot roster proof.
- one full solo staged loop proof.
- one bot pressure proof.
- one 20-player simulation report.
- one 60-player simulation report.
- one room partition load report.
- one public browser proof for the current build.
- report-secret validation.
- restart packet for known gaps.

## Failure Condition

Any report that labels simulated scale as live multiplayer fails the release gate.


# Challenge And Contract Rotation - Validator

Status: planned docs-only
System: 12
Domain: live-ops/objectives/progression

## Validator Target

Rotation validator proves deterministic challenge sets, no expired challenge rewards, and no debug-only objectives.

## Required Evidence

- source event.
- serializable snapshot.
- deterministic reset.
- mode eligibility tag.
- result or replay receipt.
- local/public ruleset consistency when deploy-facing.

## Stop Condition

Do not resolve this system if it only changes UI copy, score text, or debug data without proving receipts and player-facing outcome.

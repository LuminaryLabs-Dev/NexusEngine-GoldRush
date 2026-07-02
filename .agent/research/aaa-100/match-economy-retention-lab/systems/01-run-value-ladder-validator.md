# Run Value Ladder - Validator

Status: planned docs-only
System: 01
Domain: gameplay/economy/match

## Validator Target

Simulate a run and prove every value gain/loss has source, carry, extraction, score, and replay receipts.

## Required Evidence

- source event.
- serializable snapshot.
- deterministic reset.
- mode eligibility tag.
- result or replay receipt.
- local/public ruleset consistency when deploy-facing.

## Stop Condition

Do not resolve this system if it only changes UI copy, score text, or debug data without proving receipts and player-facing outcome.

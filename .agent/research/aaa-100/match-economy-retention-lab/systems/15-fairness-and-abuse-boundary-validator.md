# Fairness And Abuse Boundary - Validator

Status: planned docs-only
System: 15
Domain: network/security/economy

## Validator Target

Abuse simulation tries duplicate mine, out-of-range cashout, impossible cargo, stale party reward, and replay mutation.

## Required Evidence

- source event.
- serializable snapshot.
- deterministic reset.
- mode eligibility tag.
- result or replay receipt.
- local/public ruleset consistency when deploy-facing.

## Stop Condition

Do not resolve this system if it only changes UI copy, score text, or debug data without proving receipts and player-facing outcome.

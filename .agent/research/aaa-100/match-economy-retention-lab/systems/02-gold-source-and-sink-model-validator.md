# Gold Source And Sink Model - Validator

Status: planned docs-only
System: 02
Domain: gameplay/economy/progression

## Validator Target

Ledger proof verifies no duplicate gold, no negative balances, and no practice-mode persistence unless allowed.

## Required Evidence

- source event.
- serializable snapshot.
- deterministic reset.
- mode eligibility tag.
- result or replay receipt.
- local/public ruleset consistency when deploy-facing.

## Stop Condition

Do not resolve this system if it only changes UI copy, score text, or debug data without proving receipts and player-facing outcome.

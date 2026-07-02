# Replay Lesson Loop - Validator

Status: planned docs-only
System: 10
Domain: match/replay/product

## Validator Target

Receipt replay validator proves visible result lessons derive from real run events, not generic copy.

## Required Evidence

- source event.
- serializable snapshot.
- deterministic reset.
- mode eligibility tag.
- result or replay receipt.
- local/public ruleset consistency when deploy-facing.

## Stop Condition

Do not resolve this system if it only changes UI copy, score text, or debug data without proving receipts and player-facing outcome.

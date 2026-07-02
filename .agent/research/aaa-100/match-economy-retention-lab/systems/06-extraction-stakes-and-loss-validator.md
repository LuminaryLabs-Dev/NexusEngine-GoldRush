# Extraction Stakes And Loss - Validator

Status: planned docs-only
System: 06
Domain: gameplay/match/results

## Validator Target

Edge-case simulation proves disconnect, death, interruption, timeout, and contested cashout outcomes.

## Required Evidence

- source event.
- serializable snapshot.
- deterministic reset.
- mode eligibility tag.
- result or replay receipt.
- local/public ruleset consistency when deploy-facing.

## Stop Condition

Do not resolve this system if it only changes UI copy, score text, or debug data without proving receipts and player-facing outcome.

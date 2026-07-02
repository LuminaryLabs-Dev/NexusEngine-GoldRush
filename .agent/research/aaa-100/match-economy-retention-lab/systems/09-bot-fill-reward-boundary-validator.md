# Bot Fill Reward Boundary - Validator

Status: planned docs-only
System: 09
Domain: staging/progression/network

## Validator Target

Mode matrix validator proves reward/stat labels for training, bot fill, 20-player sim, 60-player sim, and future live mode.

## Required Evidence

- source event.
- serializable snapshot.
- deterministic reset.
- mode eligibility tag.
- result or replay receipt.
- local/public ruleset consistency when deploy-facing.

## Stop Condition

Do not resolve this system if it only changes UI copy, score text, or debug data without proving receipts and player-facing outcome.

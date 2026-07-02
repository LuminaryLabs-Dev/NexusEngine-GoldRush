# Loot And Tool Table - Validator

Status: planned docs-only
System: 03
Domain: gameplay/content/economy

## Validator Target

Loot table validator proves every item has role, rarity, spawn rule, effect, counterplay, and presentation placeholder.

## Required Evidence

- source event.
- serializable snapshot.
- deterministic reset.
- mode eligibility tag.
- result or replay receipt.
- local/public ruleset consistency when deploy-facing.

## Stop Condition

Do not resolve this system if it only changes UI copy, score text, or debug data without proving receipts and player-facing outcome.

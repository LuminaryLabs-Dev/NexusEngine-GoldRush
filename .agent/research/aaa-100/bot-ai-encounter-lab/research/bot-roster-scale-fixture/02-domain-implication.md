# Bot Roster Scale Fixture Domain Implication

Status: planned

## Domain Impact

- Generic candidate: `n:ai:bot-roster`
- GoldRush custom kit: `n:goldrush:staging-bot-roster`
- Consumes: mode policy, scene state, terrain/world descriptors, match phase, proof tier.
- Emits: events and snapshots consumed by gameplay, renderer, simulator, and results.

## Architecture Implication

This belongs in domain service kits, not app-host shortcuts. If it becomes too specific, split the generic candidate from the GoldRush custom rules rather than expanding one mixed kit.

## Integration Web

```txt
mode policy
-> roster and role
-> route/movement/objective
-> encounter/combat
-> receipts/results
-> proof report
```

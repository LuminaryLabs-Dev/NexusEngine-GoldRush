# Bot Difficulty Personas Data Proof

Status: planned

## Data Seed

- `personaId`
- `aimDelay`
- `routeRisk`
- `cashoutAggression`
- `recoveryBias`

## Event Seed

- `bot.persona.assigned`
- `bot.persona.scaled`
- `bot.persona.reported`

## Proof Seed

- Validator: `validate-bot-difficulty-personas.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Difficulty proof shows timing, routing, aggression, and recovery changes without hidden unfair damage spikes.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

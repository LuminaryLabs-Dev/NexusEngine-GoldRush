# Bot Terrain Movement Data Proof

Status: planned

## Data Seed

- `position`
- `velocity`
- `grounded`
- `slope`
- `groundMismatch`

## Event Seed

- `bot.move.stepped`
- `bot.ground.matched`
- `bot.route.failed`

## Proof Seed

- Validator: `validate-bot-terrain-movement.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Movement proof samples many bots and fails when they float, sink, or cross invalid blockers.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

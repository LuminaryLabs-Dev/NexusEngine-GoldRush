# Bot Resource Prospecting Data Proof

Status: planned

## Data Seed

- `botId`
- `resourceId`
- `claimState`
- `crowding`
- `estimatedValue`

## Event Seed

- `bot.prospecting.assigned`
- `bot.prospecting.started`
- `bot.prospecting.abandoned`

## Proof Seed

- Validator: `validate-bot-resource-prospecting.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Bots route toward several gold sources and create resource competition without stealing the player action surface.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

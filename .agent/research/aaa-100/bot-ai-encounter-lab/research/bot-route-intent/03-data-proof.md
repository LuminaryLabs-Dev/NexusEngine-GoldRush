# Bot Route Intent Data Proof

Status: planned

## Data Seed

- `botId`
- `routeId`
- `objectiveId`
- `waypoints`
- `riskScore`

## Event Seed

- `bot.route.planned`
- `bot.route.retargeted`
- `bot.route.blocked`

## Proof Seed

- Validator: `validate-bot-route-intent.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Routes cross map masks, mines, cover, and cashout points without teleporting or relying on proof placement helpers.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

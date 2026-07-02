# Bot Cashout Objective Data Proof

Status: planned

## Data Seed

- `siteId`
- `holdProgress`
- `contestState`
- `depositedGold`

## Event Seed

- `bot.cashout.assigned`
- `bot.cashout.started`
- `bot.cashout.completed`
- `bot.cashout.interrupted`

## Proof Seed

- Validator: `validate-bot-cashout-objective.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Bots reach cashout sites, start holds, get interrupted, and write labeled bot extraction receipts.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

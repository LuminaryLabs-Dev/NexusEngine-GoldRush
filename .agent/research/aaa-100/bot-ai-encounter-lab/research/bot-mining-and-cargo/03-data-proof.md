# Bot Mining And Cargo Data Proof

Status: planned

## Data Seed

- `carriedGold`
- `capacity`
- `weightPenalty`
- `dropEligible`

## Event Seed

- `bot.mine.started`
- `bot.cargo.added`
- `bot.cargo.dropped`

## Proof Seed

- Validator: `validate-bot-mining-cargo.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Bot cargo changes movement, threat value, score receipts, and visible dropped-gold opportunities.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

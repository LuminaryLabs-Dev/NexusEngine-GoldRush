# Bot Cover And Peek Data Proof

Status: planned

## Data Seed

- `coverId`
- `coverQuality`
- `peekWindowMs`
- `retreatTarget`

## Event Seed

- `bot.cover.claimed`
- `bot.cover.peeked`
- `bot.cover.left`

## Proof Seed

- Validator: `validate-bot-cover-peek.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Bots pick valid cover, expose readable peeks, and do not shoot from blocked or impossible positions.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

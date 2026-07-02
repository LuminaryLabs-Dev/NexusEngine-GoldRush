# Bot Roster Scale Fixture Data Proof

Status: planned

## Data Seed

- `modeId`
- `humanCount`
- `botCount`
- `squadCount`
- `proofLabel`

## Event Seed

- `bot.roster.created`
- `bot.roster.filled`
- `bot.roster.mode-labeled`

## Proof Seed

- Validator: `validate-bot-roster-scale-fixture.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Roster proof distinguishes solo staging, 20 simulated bodies, 60 simulated bodies, and future live human count.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

# Bot Spawn And Party Fill Data Proof

Status: planned

## Data Seed

- `partySize`
- `fillPolicy`
- `spawnBands`
- `reservedSpawns`

## Event Seed

- `bot.fill.applied`
- `bot.spawn.reserved`
- `bot.spawn.rejected`

## Proof Seed

- Validator: `validate-bot-spawn-party-fill.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Spawn plan keeps bots out of the party, avoids instant spawn killing, and covers mine/town/cashout regions.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

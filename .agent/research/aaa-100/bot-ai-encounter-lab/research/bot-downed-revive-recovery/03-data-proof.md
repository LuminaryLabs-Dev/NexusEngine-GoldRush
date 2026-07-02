# Bot Downed Revive Recovery Data Proof

Status: planned

## Data Seed

- `downedState`
- `reviveEligible`
- `reviveTimer`
- `eliminationReason`

## Event Seed

- `bot.downed`
- `bot.revive.started`
- `bot.revived`
- `bot.eliminated`

## Proof Seed

- Validator: `validate-bot-recovery.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Solo staging cannot deadlock on revive rules, while squad-like bot fights can show recovery windows.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

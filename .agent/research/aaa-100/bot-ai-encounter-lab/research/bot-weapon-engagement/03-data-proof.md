# Bot Weapon Engagement Data Proof

Status: planned

## Data Seed

- `weaponId`
- `aimTime`
- `accuracyBand`
- `reloadState`
- `lastShot`

## Event Seed

- `bot.weapon.aimed`
- `bot.weapon.fired`
- `bot.weapon.reloaded`
- `bot.weapon.hit`

## Proof Seed

- Validator: `validate-bot-weapon-engagement.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Combat proof includes miss windows, reload windows, hit receipts, readable muzzle/audio cue state, and damage labels.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

# Bot Threat Telegraph Data Proof

Status: planned

## Data Seed

- `botId`
- `targetId`
- `cueType`
- `cueDuration`
- `damageGate`

## Event Seed

- `bot.threat.armed`
- `bot.threat.telegraphed`
- `bot.threat.committed`

## Proof Seed

- Validator: `validate-bot-threat-telegraph.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Threats cannot damage before a minimum readable cue window and cue source is logged for screenshots.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

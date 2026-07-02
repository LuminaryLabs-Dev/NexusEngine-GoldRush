# Bot Role Taxonomy Data Proof

Status: planned

## Data Seed

- `roleId`
- `readableName`
- `intentTags`
- `allowedObjectives`
- `difficultyBand`

## Event Seed

- `bot.role.assigned`
- `bot.role.changed`
- `bot.role.coverage.warned`

## Proof Seed

- Validator: `validate-bot-role-taxonomy.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Role matrix shows coverage for prospectors, guards, ambushers, cowards, extractors, scouts, and late-rush survivors.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

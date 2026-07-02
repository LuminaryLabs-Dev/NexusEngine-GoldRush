# Encounter Director Pacing Data Proof

Status: planned

## Data Seed

- `phase`
- `tension`
- `beatId`
- `cooldowns`
- `nextWindow`

## Event Seed

- `encounter.beat.selected`
- `encounter.pressure.changed`
- `encounter.cooldown.applied`

## Proof Seed

- Validator: `validate-encounter-director-pacing.mjs`
- Browser state: snapshot visible through existing runtime state inspection later.
- Human-view: Director proof shows no immediate combat spam, no empty match, and clear beat reasons tied to player/cargo/zone state.
- Report: mode id, proof tier, human count, bot count, fakeout flags.

## Acceptance

The proof passes only when the data surface can explain what the player sees and the player view can explain the data.

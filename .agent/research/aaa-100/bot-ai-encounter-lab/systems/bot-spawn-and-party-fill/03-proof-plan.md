# Bot Spawn And Party Fill Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for bot/simulated modes.

## Human-View Proof

Spawn plan keeps bots out of the party, avoids instant spawn killing, and covers mine/town/cashout regions.

## Edge Cases

- Reset during scene transition.
- Public proof with bot labels.
- Local proof with no helper completion.
- Low frame rate or delayed tick.
- Bot count higher than visible actor budget.

## Failure Condition

Bad spawn fill makes staging unfair or makes all combat arrive from behind the player.

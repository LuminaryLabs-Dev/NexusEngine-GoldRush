# Encounter Director Pacing Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for bot/simulated modes.

## Human-View Proof

Director proof shows no immediate combat spam, no empty match, and clear beat reasons tied to player/cargo/zone state.

## Edge Cases

- Reset during scene transition.
- Public proof with bot labels.
- Local proof with no helper completion.
- Low frame rate or delayed tick.
- Bot count higher than visible actor budget.

## Failure Condition

Without a director, bots either swarm constantly or never create match drama.

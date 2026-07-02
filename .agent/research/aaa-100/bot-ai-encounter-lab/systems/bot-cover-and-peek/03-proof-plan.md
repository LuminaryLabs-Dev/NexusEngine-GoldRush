# Bot Cover And Peek Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for bot/simulated modes.

## Human-View Proof

Bots pick valid cover, expose readable peeks, and do not shoot from blocked or impossible positions.

## Edge Cases

- Reset during scene transition.
- Public proof with bot labels.
- Local proof with no helper completion.
- Low frame rate or delayed tick.
- Bot count higher than visible actor budget.

## Failure Condition

Without cover behavior, future weapon kits will hide map and encounter layout problems.

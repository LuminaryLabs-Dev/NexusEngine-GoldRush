# Bot Roster Scale Fixture Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for bot/simulated modes.

## Human-View Proof

Roster proof distinguishes solo staging, 20 simulated bodies, 60 simulated bodies, and future live human count.

## Edge Cases

- Reset during scene transition.
- Public proof with bot labels.
- Local proof with no helper completion.
- Low frame rate or delayed tick.
- Bot count higher than visible actor budget.

## Failure Condition

If roster proof is ambiguous, the project will overclaim 60-player readiness from one-browser staging.

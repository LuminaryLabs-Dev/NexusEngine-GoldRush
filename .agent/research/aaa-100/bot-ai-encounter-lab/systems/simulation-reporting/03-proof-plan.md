# Simulation Reporting Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for bot/simulated modes.

## Human-View Proof

Reports pass secret/path hygiene and label bot-fill, public smoke, local smoke, simulator, and future live proof separately.

## Edge Cases

- Reset during scene transition.
- Public proof with bot labels.
- Local proof with no helper completion.
- Low frame rate or delayed tick.
- Bot count higher than visible actor budget.

## Failure Condition

Unsanitized or mislabeled reports will create security risk and false completion claims.

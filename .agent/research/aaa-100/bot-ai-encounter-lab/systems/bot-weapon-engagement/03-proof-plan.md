# Bot Weapon Engagement Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for bot/simulated modes.

## Human-View Proof

Combat proof includes miss windows, reload windows, hit receipts, readable muzzle/audio cue state, and damage labels.

## Edge Cases

- Reset during scene transition.
- Public proof with bot labels.
- Local proof with no helper completion.
- Low frame rate or delayed tick.
- Bot count higher than visible actor budget.

## Failure Condition

If weapon behavior is just hit receipts, combat will not reach AAA feel.

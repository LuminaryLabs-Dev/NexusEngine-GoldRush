# Bot Route Intent Proof Plan

Status: planned

## CLI Proof

- Validate schema shape.
- Validate reset.
- Validate events.
- Validate snapshot serializes.
- Validate proof labels for bot/simulated modes.

## Human-View Proof

Routes cross map masks, mines, cover, and cashout points without teleporting or relying on proof placement helpers.

## Edge Cases

- Reset during scene transition.
- Public proof with bot labels.
- Local proof with no helper completion.
- Low frame rate or delayed tick.
- Bot count higher than visible actor budget.

## Failure Condition

Without route intent, bot pressure never exercises terrain, LOD, cover, or extraction path design.

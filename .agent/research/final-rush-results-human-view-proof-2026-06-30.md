# Final Rush Results Human-View Proof

Status: active

## Domain

```txt
match/results readability
├─ n:goldrush:extraction-loop
├─ n:goldrush:match-results
├─ n:goldrush:replay-summary
└─ Playwright proof harness
```

## Research Signal

- Accessibility guidance consistently favors clear state feedback, readable status changes, and non-hidden outcome information.
- Competitive/extraction results screens need to show what happened, why the score changed, and what the player can trust on the next run.
- AAA gap for GoldRush: pressure systems must be player-readable in the result UI, not only correct in snapshots.

## Applied Rule

```txt
snapshot data may keep stable domain IDs
player-visible result copy must use readable labels
proof artifacts must be sanitized at write boundary
```

## Local Proof Target

```txt
npm run proof:final-rush-results -- --url http://127.0.0.1:5177/NexusEngine-GoldRush/
```

Proof requirements:

- launch title -> lobby -> loading -> run -> results
- arm final rush before extraction
- complete a pressure-linked extraction
- show Rush as Pressure
- show Collapse explanation
- show Collapse Cashout award
- show replay moment pressure
- avoid raw `gold.zone.*` IDs in visible text
- avoid raw threat, lane, and cashout-site IDs in visible text
- keep stable gold-zone IDs in result/replay snapshots

## Sources

- Microsoft Xbox Accessibility Guideline 109: Objective clarity - https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/109
- Microsoft Xbox Accessibility Guideline 106: Screen narration - https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/106
- Game Accessibility Guidelines full list - https://gameaccessibilityguidelines.com/full-list/

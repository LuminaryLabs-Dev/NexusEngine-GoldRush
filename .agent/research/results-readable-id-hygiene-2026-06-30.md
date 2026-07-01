# Results Readable ID Hygiene

Status: active

## Domain

```txt
match/results presentation
├─ result snapshot data keeps stable deterministic IDs
├─ browser UI converts IDs into readable player labels
└─ Playwright proof rejects raw IDs in visible result copy
```

## Research Signal

- Xbox Accessibility Guideline 109 emphasizes clear objective and progress information so players do not have to memorize or infer what happened.
- Game Accessibility Guidelines call out simple clear language, readable text formatting, current-objective reminders, and clear indication of important gameplay information.

## Applied Rule

```txt
stable ids: state, snapshots, receipts, validators
readable labels: DOM, result cards, replay copy, player-facing proof
```

## Current Result-Screen Risk

Raw IDs such as `claim-jumper-01`, `rail-depot-extract-01`, and `lane.claim-jumper-01` are useful for deterministic ledgers, but they read like debug output. The player-facing layer should show labels like `Claim Jumper`, `Rail Depot`, and `rush 0.06` while proofs still assert the raw IDs remain in state.

## Sources

- Microsoft Xbox Accessibility Guideline 109: Objective clarity - https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/109
- Game Accessibility Guidelines full list - https://gameaccessibilityguidelines.com/full-list/

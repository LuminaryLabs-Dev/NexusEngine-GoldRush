# Results Next-Action Visibility

Status: active

## Domain

```txt
results presentation
├─ result summary readability
├─ next-run/lobby actions
└─ public deploy proof
```

## AAA Gap

The results screen can be mechanically correct but still fail the player if the next action is below the first viewport. Extraction games need a clean post-run loop: understand what happened, claim reward, then immediately choose whether to run again or return to lobby.

## Applied Rule

```txt
first viewport must show:
├─ winner/outcome
├─ core score stats
├─ field read / awards / replay summary
└─ next action buttons
```

## Proof

`npm run proof:final-rush-results` now measures the result action button rectangles and fails if Lobby or Run Another Claim is outside the viewport.

`npm run proof:public` also checks action visibility after the public smoke flow reaches results.

## Sources

- Nielsen Norman Group, Visibility of System Status - https://www.nngroup.com/articles/visibility-system-status/
- Microsoft Xbox Accessibility Guideline 109: Objective clarity - https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/109
- Game Accessibility Guidelines full list - https://gameaccessibilityguidelines.com/full-list/

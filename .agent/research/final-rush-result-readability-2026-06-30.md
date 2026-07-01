# Final Rush Result Readability

Status: active

## Intention

When collapse pressure changes score, the result screen must explain it. Otherwise final-rush pressure feels arbitrary instead of like a readable battle-royale extraction rule.

## Source Notes

- Microsoft's Xbox Accessibility Guidelines provide checklist-style guidance for validating game accessibility and player-facing clarity.
- XAG UI guidance emphasizes consistent, intuitive UI so players are not disoriented across menus and mode flows.
- Game Accessibility Guidelines recommend readable text, sufficient contrast, and avoiding essential information being carried by only one visual channel.

## Domain Web

```txt
n:goldrush:final-rush
└─ owns pressure and multiplier

n:goldrush:extraction-receipts
└─ serializes pressureScalar, multiplier, goldZoneId

n:goldrush:results-screen
├─ summarizes pressure-linked receipts
├─ exposes max multiplier and pressured gold zone
└─ awards collapse cashout

n:goldrush:replay-summary
└─ adds final-rush pressure to extraction replay moments
```

## Kit Gap Closed

The extraction loop could apply final-rush pressure to receipts, but the result/replay summaries did not explain that score-affecting pressure back to the player.

This pass adds `goldrush-final-rush-result-summary-v1` to results and replay, visible result UI text, and validator assertions proving the pressure is replay-safe.

## Validator Implications

- Match lifecycle proof must assert pressure-linked receipts.
- Extraction-loop proof must assert result/replay pressure summaries.
- Public smoke retained summaries should include final-rush pressure fields when present.

## Sources

- Microsoft Xbox Accessibility Guidelines: https://learn.microsoft.com/en-us/xbox/accessibility/guidelines
- Microsoft XAG 112 UI navigation: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/112
- Game Accessibility Guidelines full list: https://gameaccessibilityguidelines.com/full-list/

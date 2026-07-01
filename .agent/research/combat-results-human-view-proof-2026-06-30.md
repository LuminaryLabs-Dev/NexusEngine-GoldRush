# Combat Results Human-View Proof

Status: active

## Purpose

Document why the combat outcome summary needs browser-visible proof, not only kit snapshot validators.

## Sources

- Microsoft Xbox Accessibility Guideline 103: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103
- Microsoft Xbox Accessibility Guideline 105: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/105
- Game Accessibility Guidelines audio-to-visual parity: https://gameaccessibilityguidelines.com/ensure-that-all-important-supplementary-information-eg-the-direction-you-are-being-shot-from-conveyed-by-audio-is-replicated-in-text-visuals/

## Domain Findings

- Results screens are part of gameplay feedback, not just decoration.
- Combat audio and threat-lane events need text/visual equivalents for post-run understanding.
- A player should be able to understand why the run felt dangerous from the final screen.
- Kit snapshots prove deterministic data; browser proof proves the human-facing DOM actually presents it.

## Kit Gap

```txt
n:goldrush:ambush-pressure
└─ emits combat receipts with telegraph/lane IDs

n:goldrush:results-screen
└─ exposes combatOutcomeSummary

browser proof
└─ verifies visible Combat field, under-fire award, and lane replay text
```

## Validator Implication

- Add Playwright proof for title -> lobby -> loading -> run -> combat receipts -> results.
- Confirm `goldrush-combat-outcome-summary-v1` exists in runtime state.
- Confirm visible results text includes combat receipts, damage, under-fire award, and `lane.claim-jumper-01`.

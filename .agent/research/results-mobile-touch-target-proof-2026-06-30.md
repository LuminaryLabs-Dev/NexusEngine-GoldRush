# Results Mobile Touch Target Proof

Status: active

## Domain

```txt
results presentation
├─ post-run action buttons
├─ mobile touch target size
└─ spacing between actions
```

## AAA Gap

A post-run loop is only playable on touch devices if the next actions are large enough to hit without precision. GoldRush results must keep `Lobby` and `Run Another Claim` readable, visible, and easy to tap after extraction.

## Applied Rule

```txt
mobile result actions:
├─ visible in the first viewport
├─ at least 48px wide
├─ at least 48px high
└─ at least 8px vertical spacing when stacked
```

## Proof

```txt
npm run proof:final-rush-results:mobile -- --url <local-or-public-url>
```

The proof records button rectangles in the retained JSON report and fails if either result action shrinks below the touch-target budget.

## Sources

- WCAG 2.2 Understanding SC 2.5.8 Target Size Minimum - https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Material Design Accessibility: touch targets - https://m2.material.io/design/usability/accessibility.html#layout-typography
- Game Accessibility Guidelines full list - https://gameaccessibilityguidelines.com/full-list/

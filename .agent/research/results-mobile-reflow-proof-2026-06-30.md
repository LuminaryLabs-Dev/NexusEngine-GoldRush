# Results Mobile Reflow Proof

Status: active

## Domain

```txt
results presentation
├─ phone viewport reflow
├─ stat-card readability
├─ first-viewport next actions
└─ no horizontal overflow
```

## AAA Gap

The desktop result screen can look clean while the mobile/small-window layout still truncates key outcome words or forces horizontal scrolling. For GoldRush, result stats like `Lockdown` and `Pressure` are the reason the run resolved the way it did, so they must remain readable at phone width.

## Applied Rule

```txt
390x844 result proof must verify:
├─ no horizontal overflow
├─ no stat value truncation
├─ next actions visible before detailed panels
├─ player-facing labels only
└─ stable IDs preserved in snapshots
```

## Proof

```txt
npm run proof:final-rush-results:mobile -- --url <local-or-public-url>
```

The proof uses the same final-rush extraction scenario as desktop, but sets the viewport to `390x844`.

## Sources

- WCAG 2.2 Understanding SC 1.4.10 Reflow - https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- web.dev Responsive Design basics - https://web.dev/learn/design/
- Game Accessibility Guidelines full list - https://gameaccessibilityguidelines.com/full-list/

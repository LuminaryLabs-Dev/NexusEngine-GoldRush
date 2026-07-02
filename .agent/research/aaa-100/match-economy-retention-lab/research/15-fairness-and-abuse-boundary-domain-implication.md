# Fairness And Abuse Boundary - Domain Implication

Status: planned docs-only
System: 15
Source: Fortnite ranked and team fill support
URL: https://www.epicgames.com/help/c-202300000001636/c-202300000001721/how-to-toggle-ranked-and-team-fill-modes-in-fortnite-a202300000014894

## Domain Implication

- Owning domain: network/security/economy.
- Generic candidate: n:runtime:fairness-boundary.
- GoldRush custom kit: n:goldrush:economy-fairness.
- The UI may present rewards, but it must not calculate them.
- The renderer may show value, but it must not own eligibility.
- Result screens may summarize receipts, but receipts must originate from domain kits.

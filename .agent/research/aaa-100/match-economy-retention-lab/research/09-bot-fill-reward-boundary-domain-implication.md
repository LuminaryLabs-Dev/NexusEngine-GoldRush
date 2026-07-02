# Bot Fill Reward Boundary - Domain Implication

Status: planned docs-only
System: 09
Source: Fortnite ranked and team fill support
URL: https://www.epicgames.com/help/c-202300000001636/c-202300000001721/how-to-toggle-ranked-and-team-fill-modes-in-fortnite-a202300000014894

## Domain Implication

- Owning domain: staging/progression/network.
- Generic candidate: n:staging:reward-boundary.
- GoldRush custom kit: n:goldrush:bot-fill-reward-boundary.
- The UI may present rewards, but it must not calculate them.
- The renderer may show value, but it must not own eligibility.
- Result screens may summarize receipts, but receipts must originate from domain kits.

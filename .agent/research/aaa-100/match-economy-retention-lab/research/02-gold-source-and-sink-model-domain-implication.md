# Gold Source And Sink Model - Domain Implication

Status: planned docs-only
System: 02
Source: PUBG official game overview
URL: https://pubg.com/en/game-info/overview

## Domain Implication

- Owning domain: gameplay/economy/progression.
- Generic candidate: n:gameplay:economy-balance.
- GoldRush custom kit: n:goldrush:gold-economy.
- The UI may present rewards, but it must not calculate them.
- The renderer may show value, but it must not own eligibility.
- Result screens may summarize receipts, but receipts must originate from domain kits.

# Risk Reward Tiers - Domain Implication

Status: planned docs-only
System: 05
Source: GitHub game engine collection
URL: https://github.com/collections/game-engines

## Domain Implication

- Owning domain: gameplay/balance/world.
- Generic candidate: n:gameplay:risk-reward.
- GoldRush custom kit: n:goldrush:risk-reward-tiers.
- The UI may present rewards, but it must not calculate them.
- The renderer may show value, but it must not own eligibility.
- Result screens may summarize receipts, but receipts must originate from domain kits.

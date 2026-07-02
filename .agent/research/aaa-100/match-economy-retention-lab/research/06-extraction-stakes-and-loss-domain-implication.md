# Extraction Stakes And Loss - Domain Implication

Status: planned docs-only
System: 06
Source: GitHub JavaScript game engine collection
URL: https://github.com/collections/javascript-game-engines

## Domain Implication

- Owning domain: gameplay/match/results.
- Generic candidate: n:gameplay:extraction-stakes.
- GoldRush custom kit: n:goldrush:extraction-stakes.
- The UI may present rewards, but it must not calculate them.
- The renderer may show value, but it must not own eligibility.
- Result screens may summarize receipts, but receipts must originate from domain kits.

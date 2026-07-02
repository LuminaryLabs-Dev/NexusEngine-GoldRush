# Challenge And Contract Rotation - Domain Implication

Status: planned docs-only
System: 12
Source: GitHub JavaScript game engine collection
URL: https://github.com/collections/javascript-game-engines

## Domain Implication

- Owning domain: live-ops/objectives/progression.
- Generic candidate: n:progression:challenge-rotation.
- GoldRush custom kit: n:goldrush:claim-challenge-rotation.
- The UI may present rewards, but it must not calculate them.
- The renderer may show value, but it must not own eligibility.
- Result screens may summarize receipts, but receipts must originate from domain kits.
